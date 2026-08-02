"use server";

import { db } from "@/db";
import { editorInvites } from "@/db/schemas/editor-invites";
import { verifyAdmin } from "@/lib/session";
import { editorInviteFormSchema, type EditorInviteFormData } from "@/zod/editor-invite";
import { revalidatePath } from "next/cache";

/** 招待の有効期限（日数） */
const EXPIRES_IN_DAYS = 14;

/**
 * 編集者の招待を発行する。
 * 1 本のリンクをチームで共有して使う前提で、上限人数を指定する。
 * 氏名は含めない。ログインした本人に入力してもらう。
 */
export async function createEditorInvite(formData: EditorInviteFormData) {
  const { userId } = await verifyAdmin();
  const data = editorInviteFormSchema.parse(formData);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + EXPIRES_IN_DAYS);

  const [invite] = await db
    .insert(editorInvites)
    .values({
      label: data.label || null,
      maxUses: data.maxUses,
      createdBy: userId,
      expiresAt,
    })
    .returning();

  revalidatePath("/admin/editor-invites");

  return invite;
}
