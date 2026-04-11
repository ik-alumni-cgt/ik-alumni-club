"use server";

import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { adminAccountFormSchema, type AdminAccountFormData } from "@/zod/admin/account";
import { verifyAdmin } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * 会員情報を更新（管理者用）
 */
export async function updateAccount(accountId: string, formData: AdminAccountFormData) {
  // 1. 管理者権限チェック
  await verifyAdmin();

  // 2. バリデーション
  const data = adminAccountFormSchema.parse(formData);

  // 3. データベース更新
  // adminロールの場合はプラン・支払い関連フィールドをクリア
  const isAdmin = data.role === "admin";

  const [updatedMember] = await db
    .update(members)
    .set({
      lastName: data.lastName,
      firstName: data.firstName,
      lastNameKana: data.lastNameKana,
      firstNameKana: data.firstNameKana,
      postalCode: data.postalCode,
      prefecture: data.prefecture,
      city: data.city,
      address: data.address,
      building: data.building || null,
      phoneNumber: data.phoneNumber,
      planId: isAdmin ? null : data.planId,
      role: data.role,
      status: data.status,
      isActive: data.isActive,
      profileCompleted: data.status === "active" ? true : false,
      ...(isAdmin && {
        paymentStatus: null,
        stripeSubscriptionId: null,
        subscriptionStartDate: null,
        subscriptionEndDate: null,
      }),
    })
    .where(eq(members.id, accountId))
    .returning();

  if (!updatedMember) {
    throw new Error("会員が見つかりません");
  }

  // 4. キャッシュ再検証
  revalidatePath("/admin/accounts");
  revalidatePath(`/admin/accounts/${accountId}`);
  revalidatePath("/admin/system-accounts");
  revalidatePath(`/admin/system-accounts/${accountId}`);

  return updatedMember;
}
