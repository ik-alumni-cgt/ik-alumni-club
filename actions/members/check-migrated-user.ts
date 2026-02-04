"use server";

import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { users } from "@/db/schemas/auth";
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

    return {
      success: true,
      isMigrated: !!member,
      userExists: true,
      // 移行ユーザーの場合、パスワードが設定されていないかチェック
      needsPasswordReset: !!member,
    };
  } catch (error) {
    console.error("Failed to check migrated user:", error);
    return { success: false, error: "ユーザー情報の確認に失敗しました" };
  }
}
