"use server";

import { db } from "@/db";
import { users, accounts } from "@/db/schemas/auth";
import { members } from "@/db/schemas/member";
import { eq, and } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

/**
 * 移行ユーザーのパスワードを設定する
 * メールアドレスで移行ユーザーを検索し、パスワードを設定する
 */
export async function setMigratedUserPassword(email: string, password: string) {
  try {
    // メールアドレスでユーザーを検索
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (!user) {
      return { success: false, error: "ユーザーが見つかりません。" };
    }

    // 移行ユーザーかどうか確認
    const member = await db.query.members.findFirst({
      where: and(eq(members.userId, user.id), eq(members.isMigrated, true)),
    });

    if (!member) {
      return { success: false, error: "移行ユーザーではありません。" };
    }

    // パスワードをハッシュ化
    const hashedPassword = await hashPassword(password);

    // accountsテーブルのパスワードを更新
    const account = await db.query.accounts.findFirst({
      where: and(
        eq(accounts.userId, user.id),
        eq(accounts.providerId, "credential")
      ),
    });

    if (account) {
      // 既存のcredentialアカウントがある場合は更新
      await db
        .update(accounts)
        .set({ password: hashedPassword, updatedAt: new Date() })
        .where(eq(accounts.id, account.id));
    } else {
      // credentialアカウントがない場合は作成
      await db.insert(accounts).values({
        id: crypto.randomUUID().replace(/-/g, "").slice(0, 10),
        accountId: email.toLowerCase(),
        providerId: "credential",
        userId: user.id,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to set password:", error);
    return { success: false, error: "パスワードの設定に失敗しました。" };
  }
}
