"use server";

import { db } from "@/db";
import { users, accounts } from "@/db/schemas/auth";
import { members } from "@/db/schemas/member";
import { eq, and } from "drizzle-orm";

/**
 * LINEアカウントを既存の移行ユーザーにリンクする
 * LINEログイン後に呼び出され、ダミーメール(@line.me)のアカウントを
 * 移行ユーザーのアカウントにマージする
 */
export async function linkLineAccountToMigratedUser(
  lineUserId: string,
  targetEmail: string
) {
  try {
    // 1. 移行ユーザーを検索
    const targetUser = await db.query.users.findFirst({
      where: eq(users.email, targetEmail.toLowerCase()),
    });

    if (!targetUser) {
      return { success: false, error: "移行ユーザーが見つかりません。" };
    }

    // 移行ユーザーかどうか確認
    const member = await db.query.members.findFirst({
      where: and(eq(members.userId, targetUser.id), eq(members.isMigrated, true)),
    });

    if (!member) {
      return { success: false, error: "移行ユーザーではありません。" };
    }

    // 2. LINEで作成された一時ユーザーを検索（@line.meのメールアドレス）
    const lineEmail = `${lineUserId}@line.me`;
    const lineUser = await db.query.users.findFirst({
      where: eq(users.email, lineEmail),
    });

    if (lineUser) {
      // LINEユーザーが別途作成されている場合、そのアカウントを移行ユーザーに紐付け直す

      // LINEアカウントを移行ユーザーに紐付け
      await db
        .update(accounts)
        .set({ userId: targetUser.id, updatedAt: new Date() })
        .where(
          and(eq(accounts.userId, lineUser.id), eq(accounts.providerId, "line"))
        );

      // 不要なLINEユーザーのレコードを削除（アカウントは移行済み）
      // 他のアカウントがないか確認
      const otherAccounts = await db.query.accounts.findFirst({
        where: eq(accounts.userId, lineUser.id),
      });

      if (!otherAccounts) {
        // 他のアカウントがなければユーザーレコードを削除
        await db.delete(users).where(eq(users.id, lineUser.id));
      }
    } else {
      // LINEアカウントが既に移行ユーザーに紐付いているか確認
      const existingLineAccount = await db.query.accounts.findFirst({
        where: and(
          eq(accounts.userId, targetUser.id),
          eq(accounts.providerId, "line")
        ),
      });

      if (existingLineAccount) {
        return { success: true, message: "既にLINEアカウントがリンクされています。" };
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to link LINE account:", error);
    return { success: false, error: "LINEアカウントのリンクに失敗しました。" };
  }
}
