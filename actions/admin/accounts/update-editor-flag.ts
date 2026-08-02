"use server";

import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { verifyAdmin } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * 編集者フラグだけを切り替える。
 *
 * 会員編集フォーム（updateAccount）は住所・電話・カナを必須にしているため、
 * LINE ログインだけの会員（氏名以外が空）では保存できない。
 * 編集者の付与はプロフィールの完成度と無関係なので、別経路にしている。
 */
export async function updateEditorFlag(accountId: string, isEditor: boolean) {
  await verifyAdmin();

  const [updated] = await db
    .update(members)
    .set({ isEditor })
    .where(eq(members.id, accountId))
    .returning();

  if (!updated) {
    throw new Error("会員が見つかりません");
  }

  revalidatePath("/admin/accounts");
  revalidatePath(`/admin/accounts/${accountId}`);

  return updated;
}
