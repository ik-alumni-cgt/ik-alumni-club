"use server";

import { db } from "@/db";
import { editorInvites } from "@/db/schemas/editor-invites";
import { verifyAdmin } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * 招待を削除する。未使用の招待を取り消す用途。
 * 既に使われた招待を消しても、付与済みの編集者権限は取り消されない。
 * その場合は会員詳細ページの編集者トグルで解除する。
 */
export async function deleteEditorInvite(inviteId: string) {
  await verifyAdmin();

  const [deleted] = await db
    .delete(editorInvites)
    .where(eq(editorInvites.id, inviteId))
    .returning();

  if (!deleted) {
    throw new Error("招待が見つかりません");
  }

  revalidatePath("/admin/editor-invites");

  return deleted;
}
