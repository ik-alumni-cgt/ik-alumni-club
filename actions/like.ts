"use server";

import { db } from "@/db";
import { likes } from "@/db/schemas/likes";
import { and, eq } from "drizzle-orm";

/**
 * リアクションを設定（同じタイプなら取り消し、違うタイプなら切り替え）
 */
export async function setReaction(
  contentType: string,
  contentId: string,
  anonymousId: string,
  reactionType: string
) {
  const existing = await db.query.likes.findFirst({
    where: and(
      eq(likes.contentType, contentType),
      eq(likes.contentId, contentId),
      eq(likes.anonymousId, anonymousId)
    ),
  });

  if (existing) {
    if (existing.reactionType === reactionType) {
      // 同じタイプ → 取り消し
      await db.delete(likes).where(eq(likes.id, existing.id));
      return { reactionType: null };
    }
    // 違うタイプ → 切り替え
    await db
      .update(likes)
      .set({ reactionType })
      .where(eq(likes.id, existing.id));
    return { reactionType };
  }

  // 新規リアクション
  await db.insert(likes).values({
    contentType,
    contentId,
    anonymousId,
    reactionType,
  });

  return { reactionType };
}

/**
 * 自分のリアクションタイプを取得
 */
export async function getMyReaction(
  contentType: string,
  contentId: string,
  anonymousId: string
): Promise<string | null> {
  const existing = await db.query.likes.findFirst({
    where: and(
      eq(likes.contentType, contentType),
      eq(likes.contentId, contentId),
      eq(likes.anonymousId, anonymousId)
    ),
  });

  return existing?.reactionType ?? null;
}
