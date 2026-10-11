import "server-only";
import { getReactionCounts } from "@/data/like";
import type { VoteChoice } from "@/zod/vote";

export const VOTE_CONTENT_TYPE = "event-vote";
export const VOTE_CONTENT_ID = "challenge";

export type VoteCounts = Record<VoteChoice, number>;

// 締め切りは環境変数の切り替え + 再デプロイで行う（イベント当日限りの仮ページのため）
export const isVoteClosed = () => process.env.NEXT_PUBLIC_VOTE_CLOSED === "true";

export const getVoteCounts = async (): Promise<VoteCounts> => {
  const counts = await getReactionCounts(VOTE_CONTENT_TYPE, VOTE_CONTENT_ID);
  return {
    success: counts.success ?? 0,
    failure: counts.failure ?? 0,
  };
};
