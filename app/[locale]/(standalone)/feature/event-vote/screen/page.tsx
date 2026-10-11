import type { Metadata } from "next";
import { setLocale } from "@/app/web/i18n/set-locale";
import { getVoteCounts, isVoteClosed } from "@/data/vote";
import { getBaseURL } from "@/lib/get-base-url";
import { VoteScreen } from "@/components/event-vote/vote-screen";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "投票結果スクリーン",
  robots: { index: false, follow: false },
};

export default async function EventVoteScreenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const counts = await getVoteCounts();
  const voteUrl = `${getBaseURL()}/feature/event-vote`.replace(/^https?:\/\//, "");

  return (
    <VoteScreen
      initialCounts={counts}
      initialIsClosed={isVoteClosed()}
      voteUrl={voteUrl}
    />
  );
}
