"use client";

import Image from "next/image";
import { useVoteCounts } from "@/hooks/use-vote-counts";
import type { VoteCounts } from "@/data/vote";
import logo from "@/components/header/logo_main.png";
import { CHOICES, getPercentages } from "./choices";

type Props = {
  initialCounts: VoteCounts;
  initialIsClosed: boolean;
  voteUrl: string;
};

export function VoteScreen({ initialCounts, initialIsClosed, voteUrl }: Props) {
  const { counts, isClosed } = useVoteCounts({
    initialCounts,
    initialIsClosed,
    isEnabled: true,
  });
  const percentages = getPercentages(counts);
  const total = counts.success + counts.failure;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#14166b] to-black px-[4vw] py-[3vw] text-white">
      <header className="flex items-center justify-between">
        <Image src={logo} alt="IK ALUMNI COLOR GUARD TEAM" className="h-[9vw] w-auto" priority />
        <div className="text-right">
          <p className="text-[3.2vw] font-bold">この企画、成功する? 失敗する?</p>
          <p className="text-[1.6vw] text-white/80">
            {isClosed ? "投票は締め切りました" : "スマホで投票してください"}
          </p>
        </div>
      </header>

      <main className="my-[2vw] grid flex-1 grid-cols-2 gap-[3vw]">
        {CHOICES.map((choice) => (
          <section
            key={choice.value}
            className="flex flex-col justify-between rounded-3xl border-2 border-white/30 bg-white/5 p-[2.5vw]"
          >
            <div>
              <p
                className="text-[2vw] tracking-widest text-white/80"
                style={{ fontFamily: "var(--font-academy)" }}
              >
                {choice.en}
              </p>
              <p className="text-[6vw] font-bold leading-none">{choice.label}</p>
            </div>
            <div>
              <p
                className="text-[14vw] font-bold leading-none tabular-nums"
                style={{ fontFamily: "var(--font-academy)" }}
              >
                {percentages[choice.value]}
                <span className="text-[5vw]">%</span>
              </p>
              <p className="mt-[1vw] text-[3vw] tabular-nums text-white/80">
                {counts[choice.value]} 票
              </p>
              <div className="mt-[1.5vw] h-[3vw] overflow-hidden rounded-full bg-white/15">
                <div
                  className={`h-full rounded-full transition-[width] duration-700 ease-out ${choice.barClass}`}
                  style={{ width: `${percentages[choice.value]}%` }}
                />
              </div>
            </div>
          </section>
        ))}
      </main>

      <footer className="flex items-end justify-between text-[1.8vw] text-white/80">
        <p>
          投票ページ <span className="font-bold text-white">{voteUrl}</span>
        </p>
        <p className="tabular-nums">合計 {total} 票</p>
      </footer>
    </div>
  );
}
