import "server-only"

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { blogs } from "@/db/schemas/blogs";
import { eq } from "drizzle-orm";
import type { MemberWithPlan } from "@/types/member";

export const verifySession = async() => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login");
  }

  return session;
}

export const verifyAdmin = async() => {
  const session = await verifySession();
  const userId = session.user.id;

  const member = await db.query.members.findFirst({
    where: eq(members.userId, userId),
  });

  if (!member || member.role !== "admin") {
    throw new Error("管理者権限が必要です");
  }

  return { userId, memberId: member.id, member };
}

export const verifyOfficer = async() => {
  const session = await verifySession();
  const userId = session.user.id;

  const member = await db.query.members.findFirst({
    where: eq(members.userId, userId),
  });

  if (!member || (member.role !== "admin" && member.role !== "officer")) {
    throw new Error("役員権限が必要です");
  }

  return { userId, memberId: member.id, member };
}

/**
 * アクティブな会員であることを確認
 * status === 'active' の場合のみアクセス可能
 */
export const verifyActiveMember = async() => {
  const session = await verifySession();
  const userId = session.user.id;

  const member = await db.query.members.findFirst({
    where: eq(members.userId, userId),
    with: {
      plan: true,
    },
  });

  if (!member) {
    throw new Error("会員情報が見つかりません");
  }

  // ステータスチェック
  if (member.status !== "active") {
    // プロフィール未完成の場合はプロフィール入力ページにリダイレクト
    if (member.status === "pending_profile") {
      redirect("/profile/complete");
    }
    // チームメンバーの承認待ちは承認待ちページへ
    if (member.status === "pending_approval") {
      redirect("/team-login/pending");
    }
    // 退会済みの場合はエラー
    if (member.status === "inactive") {
      throw new Error("このアカウントは無効化されています");
    }
    throw new Error("コンテンツにアクセスするには会員登録を完了してください");
  }

  return { userId, memberId: member.id, member };
}

/**
 * チームメンバー（team_member）または管理者であることを確認
 * team_member は status === 'active' の場合のみアクセス可能。
 * 承認待ち（pending_approval）は承認待ちページへリダイレクトする。
 * /team-blog 配下のガードとして使用する。
 */
export const verifyTeamMemberOrAdmin = async() => {
  const session = await verifySession();
  const userId = session.user.id;

  const member = await db.query.members.findFirst({
    where: eq(members.userId, userId),
  });

  if (!member) {
    redirect("/");
  }

  // 管理者は status に依らずアクセス可能
  if (member.role === "admin") {
    return { userId, memberId: member.id, member };
  }

  // チームメンバーは承認済み（active）のみアクセス可能
  if (member.role === "team_member") {
    if (member.status === "pending_approval") {
      redirect("/team-login/pending");
    }
    if (member.status !== "active") {
      redirect("/");
    }
    return { userId, memberId: member.id, member };
  }

  // それ以外のロールはアクセス不可
  redirect("/");
}

/**
 * ブログ執筆権限を確認（admin または active な team_member）
 * 戻り値の member.role で「全記事編集可(admin)」「自分の記事のみ(team_member)」を判定する。
 */
export const verifyBlogWriter = async() => {
  const session = await verifySession();
  const userId = session.user.id;

  const member = await db.query.members.findFirst({
    where: eq(members.userId, userId),
  });

  if (!member) {
    throw new Error("会員情報が見つかりません");
  }

  const isWriter =
    member.role === "admin" ||
    (member.role === "team_member" && member.status === "active");

  if (!isWriter) {
    throw new Error("ブログの執筆権限がありません");
  }

  return { userId, memberId: member.id, member };
}

/**
 * 対象ブログの編集・削除権限を確認する。
 * admin は全記事、team_member は自分の記事（authorId 一致）のみ許可。
 * ブログ本体・カテゴリなど、記事に紐づく操作の共通ガードとして使用する。
 */
export const verifyCanModifyBlog = async(blogId: string) => {
  const { userId, member } = await verifyBlogWriter();

  // admin は全記事を操作可能
  if (member.role === "admin") {
    return { userId, member };
  }

  // team_member は自分の記事のみ
  const target = await db.query.blogs.findFirst({
    where: eq(blogs.id, blogId),
    columns: { authorId: true },
  });

  if (!target) {
    throw new Error("ブログが見つかりません");
  }

  if (target.authorId !== userId) {
    throw new Error("この記事を編集する権限がありません");
  }

  return { userId, member };
}

/**
 * コンテンツへのアクセス権限をチェック
 * プラン階層レベルで判定
 */
export const canAccessContent = (
  member: MemberWithPlan,
  requiredPlanLevel: number
): boolean => {
  // 管理者は全てアクセス可能
  if (member.role === "admin") {
    return true;
  }

  // ステータスチェック
  if (member.status !== "active") {
    return false;
  }

  // プランが設定されていない場合はアクセス不可
  if (!member.plan) {
    return false;
  }

  // プラン階層チェック
  // hierarchyLevel が大きいほど上位プラン
  // 例: Platinum(3) >= Business(2) >= Individual(1)
  return member.plan.hierarchyLevel >= requiredPlanLevel;
}

/**
 * 現在のユーザーが会員限定コンテンツにアクセス可能かチェック
 * セッションがない場合や会員でない場合は false を返す
 */
export const canAccessMemberContent = async (): Promise<boolean> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // セッションがない場合は非会員
    if (!session) {
      return false;
    }

    const userId = session.user.id;
    const member = await db.query.members.findFirst({
      where: eq(members.userId, userId),
      with: {
        plan: true,
      },
    });

    // 会員情報がない、またはステータスがactiveでない場合はアクセス不可
    if (!member || member.status !== "active") {
      return false;
    }

    return true;
  } catch (error) {
    // エラーが発生した場合は安全側に倒してアクセス不可
    console.error("Error checking member access:", error);
    return false;
  }
}

/**
 * 現在のユーザーの会員情報を取得（オプショナル）
 * セッションがない場合や会員でない場合は null を返す
 */
export const getCurrentMember = async (): Promise<MemberWithPlan | null> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return null;
    }

    const userId = session.user.id;
    const member = await db.query.members.findFirst({
      where: eq(members.userId, userId),
      with: {
        plan: true,
      },
    });

    return member as MemberWithPlan | null;
  } catch (error) {
    console.error("Error getting current member:", error);
    return null;
  }
}