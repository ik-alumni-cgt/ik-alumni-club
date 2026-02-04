"use server";

import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { users, accounts } from "@/db/schemas/auth";
import { eq, and } from "drizzle-orm";

/**
 * メールアドレスで移行ユーザーかどうかをチェック
 * ログイン前に呼び出されるため、認証不要
 */
export async function checkMigratedUser(email: string) {
  try {
    // usersテーブルからメールアドレスでユーザーを検索
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (!user) {
      return { success: true, isMigrated: false, userExists: false };
    }

    // membersテーブルで移行フラグをチェック
    const member = await db.query.members.findFirst({
      where: and(eq(members.userId, user.id), eq(members.isMigrated, true)),
    });

    if (!member) {
      return {
        success: true,
        isMigrated: false,
        userExists: true,
        needsPasswordReset: false,
      };
    }

    // 移行ユーザーの場合、パスワードが設定されているかチェック
    const credentialAccount = await db.query.accounts.findFirst({
      where: and(
        eq(accounts.userId, user.id),
        eq(accounts.providerId, "credential")
      ),
    });

    // パスワードがnullまたは空の場合はパスワード設定が必要
    const needsPasswordReset = !credentialAccount?.password;

    return {
      success: true,
      isMigrated: true,
      userExists: true,
      needsPasswordReset,
    };
  } catch (error) {
    console.error("Failed to check migrated user:", error);
    return { success: false, error: "ユーザー情報の確認に失敗しました" };
  }
}
