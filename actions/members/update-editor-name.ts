"use server";

import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { verifyEditorForProfile } from "@/lib/session";
import { editorNameFormSchema, type EditorNameFormData } from "@/zod/member-profile";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * 編集者の氏名を登録する。
 * メンバーブログは氏名が入力済みであることを利用条件にしているため、
 * 氏名未入力の編集者はこの action を通してから執筆エリアに入る。
 */
export async function updateEditorName(formData: EditorNameFormData) {
  const { memberId } = await verifyEditorForProfile();
  const data = editorNameFormSchema.parse(formData);

  const [updated] = await db
    .update(members)
    .set({ lastName: data.lastName, firstName: data.firstName })
    .where(eq(members.id, memberId))
    .returning();

  if (!updated) {
    throw new Error("会員情報が見つかりません");
  }

  revalidatePath("/team-blog");

  return updated;
}
