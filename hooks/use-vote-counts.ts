"use client";

import { useCallback, useEffect, useState } from "react";
import type { VoteCounts } from "@/data/vote";
import type { VoteChoice } from "@/zod/vote";

const POLLING_INTERVAL_MS = 3000;

type VoteResponse = {
  counts: VoteCounts;
  isClosed: boolean;
};

export const useVoteCounts = ({
  initialCounts,
  initialIsClosed,
  isEnabled,
}: {
  initialCounts: VoteCounts;
  initialIsClosed: boolean;
  isEnabled: boolean;
}) => {
  const [counts, setCounts] = useState(initialCounts);
  const [isClosed, setIsClosed] = useState(initialIsClosed);

  useEffect(() => {
    if (!isEnabled || isClosed) return;

    const fetchCounts = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const response = await fetch("/api/vote");
        if (!response.ok) return;
        const data: VoteResponse = await response.json();
        // 票は減らないので、CDN キャッシュの古い値で表示が戻らないよう最大値を採用する
        setCounts((prev) => ({
          success: Math.max(prev.success, data.counts.success),
          failure: Math.max(prev.failure, data.counts.failure),
        }));
        setIsClosed(data.isClosed);
      } catch (error) {
        console.error("投票数の取得に失敗しました:", error);
      }
    };

    fetchCounts();
    const timer = setInterval(fetchCounts, POLLING_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isEnabled, isClosed]);

  const addVote = useCallback((choice: VoteChoice) => {
    setCounts((prev) => ({ ...prev, [choice]: prev[choice] + 1 }));
  }, []);

  const markClosed = useCallback(() => setIsClosed(true), []);

  return { counts, isClosed, addVote, markClosed };
};
