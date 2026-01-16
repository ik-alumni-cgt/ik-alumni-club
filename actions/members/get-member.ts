"use server";

import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { eq } from "drizzle-orm";
import { verifySession } from "@/lib/session";
import { createMemberAfterSignup } from "./create-member";

/**
 * 現在ログイン中のユーザーのmember情報を取得
 * membersレコードが存在しない場合（ソーシャルログイン時など）は自動作成
 */
export async function getCurrentMember() {
  try {
    const session = await verifySession();
    const userId = session.user.id;
    const userEmail = session.user.email;

    let member = await db.query.members.findFirst({
      where: eq(members.userId, userId),
      with: {
        plan: true,
      },
    });

    // membersレコードが存在しない場合は自動作成（ソーシャルログイン対応）
    if (!member) {
      const createResult = await createMemberAfterSignup(userId, userEmail);
      if (!createResult.success) {
        return { success: false, error: "会員情報の作成に失敗しました" };
      }

      // 作成後に再取得（planリレーションを含めるため）
      member = await db.query.members.findFirst({
        where: eq(members.userId, userId),
        with: {
          plan: true,
        },
      });

      if (!member) {
        return { success: false, error: "会員情報が見つかりません" };
      }
    }

    return { success: true, data: member };
  } catch (error) {
    console.error("Failed to get current member:", error);
    return { success: false, error: "会員情報の取得に失敗しました" };
  }
}
