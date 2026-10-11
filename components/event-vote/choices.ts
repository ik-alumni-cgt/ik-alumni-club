import type { VoteCounts } from "@/data/vote";
import type { VoteChoice } from "@/zod/vote";

export const CHOICES: {
  value: VoteChoice;
  label: string;
  en: string;
  barClass: string;
}[] = [
  { value: "success", label: "成功", en: "SUCCESS", barClass: "bg-[#e60012]" },
  { value: "failure", label: "失敗", en: "FAILURE", barClass: "bg-[#3b4cca]" },
];

// 合計が必ず 100 になるように、失敗側は残りで算出する
export const getPercentages = (counts: VoteCounts): Record<VoteChoice, number> => {
  const total = counts.success + counts.failure;
  if (total === 0) return { success: 0, failure: 0 };
  const success = Math.round((counts.success / total) * 100);
  return { success, failure: 100 - success };
};
