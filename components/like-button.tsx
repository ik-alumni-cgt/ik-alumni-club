"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { setReaction, getMyReaction } from "@/actions/like";
import type { ReactionCounts } from "@/data/like";

const REACTION_TYPES = [
  "aoi1",
  "hiroaki",
  "kaho",
  "natuki",
  "ryo",
  "sakura",
  "taisei",
  "yuma",
] as const;

type Props = {
  contentType: string;
  contentId: string;
  initialReactionCounts: ReactionCounts;
  userId?: string | null;
};

const ANONYMOUS_ID_KEY = "like-anonymous-id";

function getAnonymousId(): string {
  const stored = localStorage.getItem(ANONYMOUS_ID_KEY);
  if (stored) return stored;

  const id = crypto.randomUUID();
  localStorage.setItem(ANONYMOUS_ID_KEY, id);
  return id;
}

export function LikeButton({
  contentType,
  contentId,
  initialReactionCounts,
  userId,
}: Props) {
  const [myReaction, setMyReaction] = useState<string | null>(null);
  const [counts, setCounts] = useState<ReactionCounts>(initialReactionCounts);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  const getIdentifier = () => userId ?? getAnonymousId();

  useEffect(() => {
    setMounted(true);
    const id = getIdentifier();
    getMyReaction(contentType, contentId, id).then(setMyReaction);
  }, [contentType, contentId, userId]);

  const handleReaction = (reactionType: string) => {
    if (isPending) return;

    const id = getIdentifier();
    const prevReaction = myReaction;
    const prevCounts = { ...counts };

    // 楽観的更新
    const newCounts = { ...counts };
    if (prevReaction) {
      newCounts[prevReaction] = Math.max((newCounts[prevReaction] ?? 0) - 1, 0);
      if (newCounts[prevReaction] === 0) delete newCounts[prevReaction];
    }

    if (prevReaction === reactionType) {
      setMyReaction(null);
    } else {
      newCounts[reactionType] = (newCounts[reactionType] ?? 0) + 1;
      setMyReaction(reactionType);
    }
    setCounts(newCounts);
    setPickerOpen(false);

    startTransition(async () => {
      try {
        const result = await setReaction(contentType, contentId, id, reactionType);
        setMyReaction(result.reactionType);
      } catch {
        setMyReaction(prevReaction);
        setCounts(prevCounts);
      }
    });
  };

  if (!mounted) {
    return <ReactionDisplay counts={initialReactionCounts} myReaction={null} onAdd={() => {}} />;
  }

  return (
    <div className="relative">
      <ReactionDisplay
        counts={counts}
        myReaction={myReaction}
        onAdd={() => setPickerOpen(!pickerOpen)}
        onReactionClick={handleReaction}
        disabled={isPending}
      />
      {pickerOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setPickerOpen(false)} />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-white rounded-xl shadow-lg border p-3 max-w-[calc(100vw-2rem)]">
            <div className="flex gap-2 overflow-x-auto">
              {REACTION_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => handleReaction(type)}
                  disabled={isPending}
                  className={`relative w-12 h-12 rounded-lg transition-all hover:scale-110 ${
                    myReaction === type
                      ? "bg-gray-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Image
                    src={`/icons/${type}.png`}
                    alt={type}
                    fill
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ReactionDisplay({
  counts,
  myReaction,
  onAdd,
  onReactionClick,
  disabled,
}: {
  counts: ReactionCounts;
  myReaction: string | null;
  onAdd: () => void;
  onReactionClick?: (type: string) => void;
  disabled?: boolean;
}) {
  const activeReactions = Object.entries(counts).filter(([, count]) => count > 0);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={onAdd}
        disabled={disabled}
        className="flex items-center justify-center px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500 text-sm"
        aria-label="リアクションを追加"
      >
        ＋いいね
      </button>
      {activeReactions.map(([type, count]) => (
        <button
          key={type}
          onClick={() => onReactionClick?.(type)}
          disabled={disabled}
          className={`flex items-center gap-1 px-2 py-1 rounded-full border transition-colors text-gray-700 ${
            myReaction === type
              ? "border-gray-300 bg-gray-50"
              : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          <Image
            src={`/icons/${type}.png`}
            alt={type}
            width={24}
            height={24}
            className="object-contain"
          />
          <span className="text-sm font-medium">{count}</span>
        </button>
      ))}
    </div>
  );
}
