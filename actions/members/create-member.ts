"use server";

import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { users } from "@/db/schemas/auth";
import { eq } from "drizzle-orm";
import { sendSignupNotificationEmail } from "@/lib/email";

/**
 * サインアップ後にmemberレコードを作成
 */
export async function createMemberAfterSignup(
  userId: string,
  email: string,
  planId?: number
) {
  try {
    // 既にmemberレコードが存在するかチェック
    const existingMember = await db
      .select()
      .from(members)
      .where(eq(members.userId, userId))
      .limit(1);

    if (existingMember.length > 0) {
      return { success: true, data: existingMember[0] };
    }

    // ユーザー名を取得
    const user = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const userName = user[0]?.name || "不明";

    // memberレコード作成
    const newMember = await db
      .insert(members)
      .values({
        userId,
        email,
        planId: planId || null,
        role: "member",
        status: "pending_profile",
        profileCompleted: false,
        isActive: true,
      })
      .returning();

    // サインアップ通知メールを管理者に送信（失敗しても登録処理は継続）
    try {
      await sendSignupNotificationEmail({ name: userName, email });
    } catch (emailError) {
      console.error("Failed to send signup notification email:", emailError);
    }

    return { success: true, data: newMember[0] };
  } catch (error) {
    console.error("Failed to create member:", error);
    return { success: false, error: "会員情報の作成に失敗しました" };
  }
}

/**
 * memberレコードのplanIdを更新
 */
export async function updateMemberPlan(userId: string, planId: number) {
  try {
    const updated = await db
      .update(members)
      .set({ planId })
      .where(eq(members.userId, userId))
      .returning();

    if (updated.length === 0) {
      return { success: false, error: "会員情報が見つかりません" };
    }

    return { success: true, data: updated[0] };
  } catch (error) {
    console.error("Failed to update member plan:", error);
    return { success: false, error: "プラン情報の更新に失敗しました" };
  }
}
