"use server";

import { db } from "@/db";
import { editorInvites, editorInviteUses } from "@/db/schemas/editor-invites";
import { members } from "@/db/schemas/member";
import { getInviteState } from "@/data/editor-invite";
import { and, eq, lt, sql } from "drizzle-orm";

type AcceptResult =
  | { ok: true }
  | { ok: false; reason: "not_found" | "full" | "expired" };

/**
 * 共有された招待リンクを受領して、ログイン中のユーザーに編集者権限を付ける。
 *
 * - 会員レコードが無ければ作る（支払い状態は触らない）
 * - 既存の会員は role や status を変えず、編集者フラグだけ立てる
 * - 同じ人が二度開いても上限を余計に消費しない
 */
export async function acceptEditorInvite(
  token: string,
  userId: string,
  email: string | null
): Promise<AcceptResult> {
  const invite = await db.query.editorInvites.findFirst({
    where: eq(editorInvites.token, token),
  });

  if (!invite) {
    return { ok: false, reason: "not_found" };
  }

  const alreadyUsed = await db.query.editorInviteUses.findFirst({
    where: and(
      eq(editorInviteUses.inviteId, invite.id),
      eq(editorInviteUses.userId, userId)
    ),
  });

  // 初めて使う場合だけ上限を消費する
  if (!alreadyUsed) {
    const state = getInviteState(invite);
    if (state !== "valid") {
      return { ok: false, reason: state === "not_found" ? "not_found" : state };
    }

    // 上限に達していないことを条件に加算し、同時アクセスでの超過を防ぐ
    const [claimed] = await db
      .update(editorInvites)
      .set({ usedCount: sql`${editorInvites.usedCount} + 1` })
      .where(
        and(
          eq(editorInvites.id, invite.id),
          lt(editorInvites.usedCount, invite.maxUses)
        )
      )
      .returning();

    if (!claimed) {
      return { ok: false, reason: "full" };
    }

    await db.insert(editorInviteUses).values({ inviteId: invite.id, userId });
  }

  const existing = await db.query.members.findFirst({
    where: eq(members.userId, userId),
  });

  if (existing) {
    await db
      .update(members)
      .set({ isEditor: true })
      .where(eq(members.userId, userId));
    return { ok: true };
  }

  // LINE のダミーメール（@line.me）は unique 制約の衝突を避けるため保存しない
  const safeEmail = email && !email.endsWith("@line.me") ? email : null;

  await db.insert(members).values({
    userId,
    email: safeEmail,
    role: "member",
    status: "pending_profile",
    profileCompleted: false,
    isActive: true,
    isEditor: true,
  });

  return { ok: true };
}
