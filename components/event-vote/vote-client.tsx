"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { castVote, getMyVote } from "@/actions/vote";
import { useVoteCounts } from "@/hooks/use-vote-counts";
import type { VoteCounts } from "@/data/vote";
import type { VoteChoice } from "@/zod/vote";
import { CHOICES } from "./choices";
import { VoteResults } from "./vote-results";

const ANONYMOUS_ID_KEY = "event-vote-anonymous-id";

type Props = {
  initialCounts: VoteCounts;
  initialIsClosed: boolean;
};

export function VoteClient({ initialCounts, initialIsClosed }: Props) {
  const [myChoice, setMyChoice] = useState<VoteChoice | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fallbackIdRef = useRef<string | null>(null);

  const { counts, isClosed, addVote, markClosed } = useVoteCounts({
    initialCounts,
    initialIsClosed,
    isEnabled: myChoice !== null,
  });

  // localStorage が使えない環境（プライベートブラウズ等）ではメモリ上の ID で代替する
  const getAnonymousId = () => {
    try {
      const stored = localStorage.getItem(ANONYMOUS_ID_KEY);
      if (stored) return stored;
      const id = crypto.randomUUID();
      localStorage.setItem(ANONYMOUS_ID_KEY, id);
      return id;
    } catch {
      fallbackIdRef.current ??= crypto.randomUUID();
      return fallbackIdRef.current;
    }
  };

  useEffect(() => {
    getMyVote(getAnonymousId())
      .then(setMyChoice)
      .catch((error) => console.error("投票状況の取得に失敗しました:", error))
      .finally(() => setIsReady(true));
  }, []);

  const handleVote = (choice: VoteChoice) => {
    if (isPending || myChoice) return;
    setErrorMessage(null);

    startTransition(async () => {
      try {
        const result = await castVote({ anonymousId: getAnonymousId(), choice });
        if (result.choice) setMyChoice(result.choice);
        if (result.status === "voted") addVote(choice);
        if (result.status === "closed") markClosed();
      } catch (error) {
        console.error("投票に失敗しました:", error);
        setErrorMessage("投票に失敗しました。電波の良い場所でもう一度お試しください。");
      }
    });
  };

  const hasResults = myChoice !== null || isClosed;

  return (
    <div>
      {hasResults ? (
        <div>
          <p className="mb-6 text-center text-base font-bold text-white">
            {isClosed
              ? "投票は締め切りました。結果はこちらです"
              : "投票ありがとうございました"}
          </p>
          <VoteResults counts={counts} myChoice={myChoice} />
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-3">
            {CHOICES.map((choice) => (
              <button
                key={choice.value}
                type="button"
                disabled={!isReady || isPending}
                onClick={() => handleVote(choice.value)}
                className={`flex min-h-44 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-white/80 text-white shadow-lg transition-transform active:scale-95 disabled:opacity-60 ${choice.barClass}`}
              >
                <span
                  className="text-sm tracking-widest"
                  style={{ fontFamily: "var(--font-academy)" }}
                >
                  {choice.en}
                </span>
                <span className="text-5xl font-bold">{choice.label}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-white/70">
            投票は 1 人 1 回、あとから変更できません
          </p>
          {errorMessage && (
            <p className="mt-3 text-center text-sm font-bold text-[#ffb3b8]">
              {errorMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
