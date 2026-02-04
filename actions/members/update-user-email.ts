"use server";

import { db } from "@/db";
import { users, accounts } from "@/db/schemas/auth";
import { members } from "@/db/schemas/member";
import { eq } from "drizzle-orm";
import { createMemberAfterSignup } from "./create-member";

/**
 * ユーザーのメールアドレスを更新する
 * LINEログイン後にダミーメールアドレスを本物のメールアドレスに更新
 */
export async function updateUserEmail(
  userId: string,
  newEmail: string,
  planId?: string
) {
  try {
    const normalizedEmail = newEmail.toLowerCase().trim();

    // メールアドレスの重複チェック
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });

    if (existingUser && existingUser.id !== userId) {
      return {
        success: false,
        error: "このメールアドレスは既に使用されています。",
      };
    }

    // ユーザーのメールアドレスを更新
    await db
      .update(users)
      .set({ email: normalizedEmail, updatedAt: new Date() })
      .where(eq(users.id, userId));

    // accountsテーブルのaccountIdも更新（LINEアカウントの場合はそのまま）
    // credentialアカウントがあれば更新
    const credentialAccount = await db.query.accounts.findFirst({
      where: eq(accounts.userId, userId),
    });

    if (credentialAccount && credentialAccount.providerId === "credential") {
      await db
        .update(accounts)
        .set({ accountId: normalizedEmail, updatedAt: new Date() })
        .where(eq(accounts.id, credentialAccount.id));
    }

    // memberレコードがあれば更新、なければ作成
    const existingMember = await db.query.members.findFirst({
      where: eq(members.userId, userId),
    });

    if (existingMember) {
      // 既存のmemberレコードのメールアドレスを更新
      await db
        .update(members)
        .set({ email: normalizedEmail, updatedAt: new Date() })
        .where(eq(members.userId, userId));
    } else {
      // memberレコードを新規作成
      await createMemberAfterSignup(
        userId,
        normalizedEmail,
        planId ? parseInt(planId) : undefined
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to update user email:", error);
    return { success: false, error: "メールアドレスの更新に失敗しました。" };
  }
}
