"use server";

import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { eq } from "drizzle-orm";

/**
 * /team-login 経由で LINE ログインしたユーザーに会員レコードを用意する。
 *
 * 目的は「管理画面の会員一覧に出てくるようにする」ことだけ。
 * 編集者フラグ（is_editor）と支払い状態（payment_status）は触らない。
 * - is_editor は管理者が会員編集フォームで付与する
 * - payment_status は Stripe Webhook が書き込む列なので手を出さない
 *
 * 既存の会員レコードがある場合は何もしない（権限やステータスを降格させない）。
 */
export async function provisionLineMember(userId: string, email: string | null) {
  const existing = await db.query.members.findFirst({
    where: eq(members.userId, userId),
  });

  if (existing) {
    return { created: false };
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
  });

  return { created: true };
}
