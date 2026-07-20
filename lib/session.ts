import "server-only"

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { accounts } from "@/db/schemas/auth";
import { blogs } from "@/db/schemas/blogs";
import { and, eq } from "drizzle-orm";
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
    // 退会済みの場合はエラー
    if (member.status === "inactive") {
      throw new Error("このアカウントは無効化されています");
    }
    throw new Error("コンテンツにアクセスするには会員登録を完了してください");
  }

  return { userId, memberId: member.id, member };
}

/** 編集者エリアの入口。編集者は LINE ログインのみを使う。 */
export const EDITOR_LOGIN_PATH = "/team-login";
/**
 * 氏名未入力の編集者を誘導する先。
 * /team-blog 配下に置くとレイアウトのガードと無限ループになるため、
 * ログイン導線側（/team-login 配下）に置く。
 */
export const EDITOR_PROFILE_PATH = "/team-login/profile";

/** 編集者ゲートを通らなかった理由。画面側の出し分けに使う。 */
export type EditorDeniedReason =
  | "no_session"
  | "line_required"
  | "not_editor"
  | "unpaid"
  | "name_required";

/** 編集者ゲートを通らなかった理由の日本語メッセージ。 */
export const EDITOR_DENIED_MESSAGES: Record<EditorDeniedReason, string> = {
  no_session: "ログインが必要です",
  line_required: "LINE でのログインが必要です",
  not_editor: "ブログの執筆権限がありません",
  unpaid: "お支払いが完了していないため利用できません",
  name_required: "氏名を入力してください",
};

type EditorAccess =
  | {
      ok: true;
      userId: string;
      memberId: string;
      member: typeof members.$inferSelect;
      isAdmin: boolean;
    }
  | { ok: false; reason: EditorDeniedReason };

/**
 * 編集者としてメンバーブログを扱えるかを判定する。
 *
 * 編集者は次の 4 条件をすべて満たす必要がある。
 *  1. LINE 連携済みのアカウントでログインしている
 *  2. 編集者フラグ（is_editor）が true
 *  3. 支払い済み（payment_status === 'completed'）
 *  4. 氏名（last_name / first_name）が入力済み
 *
 * 管理者（role === 'admin'）は従来どおり素通しする。
 * 既存の管理者運用に条件を追加しないため。
 */
const resolveEditorAccess = async(): Promise<EditorAccess> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { ok: false, reason: "no_session" };
  }

  const userId = session.user.id;
  const member = await db.query.members.findFirst({
    where: eq(members.userId, userId),
  });

  // 管理者は条件を問わず通す
  if (member && member.role === "admin") {
    return { ok: true, userId, memberId: member.id, member, isAdmin: true };
  }

  // 1. LINE 連携の確認
  const lineAccount = await db.query.accounts.findFirst({
    where: and(eq(accounts.userId, userId), eq(accounts.providerId, "line")),
    columns: { id: true },
  });

  if (!lineAccount) {
    return { ok: false, reason: "line_required" };
  }

  // 2. 編集者フラグ
  if (!member || !member.isEditor) {
    return { ok: false, reason: "not_editor" };
  }

  // 3. 支払い済み
  if (member.paymentStatus !== "completed") {
    return { ok: false, reason: "unpaid" };
  }

  // 4. 氏名の入力
  if (!member.lastName?.trim() || !member.firstName?.trim()) {
    return { ok: false, reason: "name_required" };
  }

  return { ok: true, userId, memberId: member.id, member, isAdmin: false };
}

/**
 * 編集者エリア（/team-blog 配下）のページ・レイアウト用ガード。
 * 条件を満たさない場合は理由に応じたページへリダイレクトする。
 */
export const verifyEditor = async() => {
  const access = await resolveEditorAccess();

  if (access.ok) {
    return access;
  }

  if (access.reason === "name_required") {
    redirect(EDITOR_PROFILE_PATH);
  }

  redirect(`${EDITOR_LOGIN_PATH}/denied?reason=${access.reason}`);
}

/**
 * 氏名未入力でも通す、氏名入力ページ専用のガード。
 * 氏名以外の 3 条件（LINE・編集者・支払い済み）は満たしている必要がある。
 */
export const verifyEditorForProfile = async() => {
  const access = await resolveEditorAccess();

  if (access.ok) {
    return access;
  }

  if (access.reason === "name_required") {
    // 氏名だけが未入力の状態。このページの対象なのでセッション情報を引き直す。
    const session = await verifySession();
    const userId = session.user.id;
    const member = await db.query.members.findFirst({
      where: eq(members.userId, userId),
    });

    if (!member) {
      redirect(`${EDITOR_LOGIN_PATH}/denied?reason=not_editor`);
    }

    return { ok: true as const, userId, memberId: member.id, member, isAdmin: false };
  }

  redirect(`${EDITOR_LOGIN_PATH}/denied?reason=${access.reason}`);
}

/**
 * ブログ執筆権限を確認する（Server Action 用）。
 * ページ用の verifyEditor と違い、リダイレクトではなく例外を投げる。
 */
export const verifyBlogWriter = async() => {
  const access = await resolveEditorAccess();

  if (!access.ok) {
    throw new Error(EDITOR_DENIED_MESSAGES[access.reason]);
  }

  return { userId: access.userId, memberId: access.memberId, member: access.member, isAdmin: access.isAdmin };
}

/**
 * 対象ブログの編集・削除権限を確認する。
 * admin は全記事、編集者は自分の記事（authorId 一致）のみ許可。
 * ブログ本体・カテゴリなど、記事に紐づく操作の共通ガードとして使用する。
 */
export const verifyCanModifyBlog = async(blogId: string) => {
  const { userId, member, isAdmin } = await verifyBlogWriter();

  // admin は全記事を操作可能
  if (isAdmin) {
    return { userId, member };
  }

  // 編集者は自分の記事のみ
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