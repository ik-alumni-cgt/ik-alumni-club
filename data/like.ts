import { db } from "@/db";
import { likes } from "@/db/schemas/likes";
import { and, eq, count } from "drizzle-orm";

export type ReactionCounts = Record<string, number>;

/**
 * リアクションタイプごとのカウントを取得
 */
export async function getReactionCounts(
  contentType: string,
  contentId: string
): Promise<ReactionCounts> {
  const results = await db
    .select({
      reactionType: likes.reactionType,
      count: count(),
    })
    .from(likes)
    .where(
      and(
        eq(likes.contentType, contentType),
        eq(likes.contentId, contentId)
      )
    )
    .groupBy(likes.reactionType);

  const counts: ReactionCounts = {};
  for (const row of results) {
    counts[row.reactionType] = row.count;
  }
  return counts;
}
