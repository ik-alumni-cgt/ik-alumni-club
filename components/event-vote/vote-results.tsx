import type { VoteCounts } from "@/data/vote";
import type { VoteChoice } from "@/zod/vote";
import { CHOICES, getPercentages } from "./choices";

type Props = {
  counts: VoteCounts;
  myChoice: VoteChoice | null;
};

export const VoteResults = ({ counts, myChoice }: Props) => {
  const percentages = getPercentages(counts);
  const total = counts.success + counts.failure;

  return (
    <div className="space-y-5">
      {CHOICES.map((choice) => (
        <div key={choice.value}>
          <div className="mb-2 flex items-end justify-between">
            <p className="flex items-center gap-2 text-lg font-bold text-white">
              {choice.label}
              {myChoice === choice.value && (
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-[#14166b]">
                  あなたの投票
                </span>
              )}
            </p>
            <p
              className="text-3xl font-bold tabular-nums text-white"
              style={{ fontFamily: "var(--font-academy)" }}
            >
              {percentages[choice.value]}
              <span className="text-base">%</span>
            </p>
          </div>
          <div className="h-5 overflow-hidden rounded-full bg-white/15">
            <div
              className={`h-full rounded-full transition-[width] duration-700 ease-out ${choice.barClass}`}
              style={{ width: `${percentages[choice.value]}%` }}
            />
          </div>
          <p className="mt-1 text-right text-xs tabular-nums text-white/70">
            {counts[choice.value]} 票
          </p>
        </div>
      ))}
      <p className="text-center text-sm text-white/70">
        現在の投票数 <span className="tabular-nums">{total}</span> 票
      </p>
    </div>
  );
};
