"use server";

import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { eq } from "drizzle-orm";

type ProvisionResult =
  | { outcome: "active_team_member" }
  | { outcome: "active_other" }
  | { outcome: "pending_approval" };

/**
 * /team-login 経由でログインしたユーザーを team_member として用意する。
 *
 * - 会員レコードが無ければ team_member × pending_approval で作成
 * - 既にアクティブな会員は降格させない（active はそのまま）
 * - それ以外（未完成・退会・承認待ち等）は team_member × pending_approval に揃える
 *
 * 承認（active 化）は管理画面（/admin/accounts）で行う。課金は経由しない。
 */
export async function provisionTeamMember(
  userId: string,
  email: string | null
): Promise<ProvisionResult> {
  const existing = await db.query.members.findFirst({
    where: eq(members.userId, userId),
  });

  if (existing) {
    // 既にアクティブな会員は触らない（降格防止）
    if (existing.status === "active") {
      return existing.role === "team_member"
        ? { outcome: "active_team_member" }
        : { outcome: "active_other" };
    }

    // 未アクティブは team_member の承認待ちに揃える
    if (existing.role !== "team_member" || existing.status !== "pending_approval") {
      await db
        .update(members)
        .set({ role: "team_member", status: "pending_approval" })
        .where(eq(members.userId, userId));
    }

    return { outcome: "pending_approval" };
  }

  // 新規作成（承認待ち）
  // LINE のダミーメール（@line.me）は unique 衝突を避けるため保存しない
  const safeEmail = email && !email.endsWith("@line.me") ? email : null;

  await db.insert(members).values({
    userId,
    email: safeEmail,
    role: "team_member",
    status: "pending_approval",
    profileCompleted: false,
    isActive: true,
  });

  return { outcome: "pending_approval" };
}
