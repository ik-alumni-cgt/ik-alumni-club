"use server";

import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { subscriptions } from "@/db/schemas/auth";
import { verifyAdmin } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * 会員の支払い情報をリセット（管理者用）
 * 返金対応後に再度手続きしてもらうための処理
 * - members テーブル: paymentStatus → "pending", stripeSubscriptionId → null
 * - subscriptions テーブル: Better Auth のサブスクリプションレコードを削除
 */
export async function resetPayment(accountId: string) {
  await verifyAdmin();

  const member = await db.query.members.findFirst({
    where: eq(members.id, accountId),
  });

  if (!member) {
    throw new Error("会員が見つかりません");
  }

  // members テーブルのリセット
  await db
    .update(members)
    .set({
      paymentStatus: "pending",
      stripeSubscriptionId: null,
      subscriptionStartDate: null,
      subscriptionEndDate: null,
    })
    .where(eq(members.id, accountId));

  // Better Auth の subscriptions テーブルから削除
  // referenceId = userId で紐づいている
  await db
    .delete(subscriptions)
    .where(eq(subscriptions.referenceId, member.userId));

  revalidatePath("/admin/accounts");
  revalidatePath(`/admin/accounts/${accountId}`);
}
