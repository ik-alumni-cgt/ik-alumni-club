"use server";

import { db } from "@/db";
import { likes } from "@/db/schemas/likes";
import { getMyReaction } from "@/actions/like";
import { isVoteClosed, VOTE_CONTENT_ID, VOTE_CONTENT_TYPE } from "@/data/vote";
import { castVoteSchema, voteChoiceSchema, type VoteChoice } from "@/zod/vote";

type CastVoteResult = {
  status: "voted" | "already" | "closed";
  choice: VoteChoice | null;
};

/**
 * 自分の投票内容を取得（未投票なら null）
 */
export async function getMyVote(anonymousId: string): Promise<VoteChoice | null> {
  const reaction = await getMyReaction(VOTE_CONTENT_TYPE, VOTE_CONTENT_ID, anonymousId);
  return voteChoiceSchema.safeParse(reaction).data ?? null;
}

/**
 * 投票する（1 端末 1 票・変更不可）。likes の一意制約で二重投票を防ぐ
 */
export async function castVote(input: unknown): Promise<CastVoteResult> {
  const { anonymousId, choice } = castVoteSchema.parse(input);

  if (isVoteClosed()) {
    return { status: "closed", choice: await getMyVote(anonymousId) };
  }

  const inserted = await db
    .insert(likes)
    .values({
      contentType: VOTE_CONTENT_TYPE,
      contentId: VOTE_CONTENT_ID,
      anonymousId,
      reactionType: choice,
    })
    .onConflictDoNothing()
    .returning({ id: likes.id });

  if (inserted.length > 0) {
    return { status: "voted", choice };
  }

  return { status: "already", choice: await getMyVote(anonymousId) };
}
