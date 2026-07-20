"use server";

import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { verifyAdmin } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * 承認待ち（pending_approval）のチームメンバーを承認して有効化する。
 * プロフィール未入力でも承認できるよう、会員編集フォームとは別経路にしている。
 */
export async function approveTeamMember(accountId: string) {
  await verifyAdmin();

  const [updated] = await db
    .update(members)
    .set({ role: "team_member", status: "active" })
    .where(eq(members.id, accountId))
    .returning();

  if (!updated) {
    throw new Error("会員が見つかりません");
  }

  revalidatePath("/admin/accounts");
  revalidatePath(`/admin/accounts/${accountId}`);

  return updated;
}
