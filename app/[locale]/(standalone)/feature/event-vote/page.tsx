import Image from "next/image";
import type { Metadata } from "next";
import { setLocale } from "@/app/web/i18n/set-locale";
import { getVoteCounts, isVoteClosed } from "@/data/vote";
import logo from "@/components/header/logo_main.png";
import groupPhoto from "@/app/[locale]/(main)/profiles/profile.jpg";
import { IconMarquee } from "@/components/event-vote/icon-marquee";
import { JoinCta } from "@/components/event-vote/join-cta";
import { VoteClient } from "@/components/event-vote/vote-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "企画の成否を予想しよう",
  description: "IK ALUMNI CGT の企画が成功するか失敗するか、あなたの予想に投票してください。",
  robots: { index: false, follow: false },
};

export default async function EventVotePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const counts = await getVoteCounts();
  const isClosed = isVoteClosed();

  return (
    <div className="min-h-screen bg-[#0c0d3d] text-white">
      <div className="mx-auto max-w-md">
        <header>
          <div className="relative">
            <Image
              src={groupPhoto}
              alt="IK ALUMNI CGT 集合写真"
              priority
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0c0d3d] to-transparent" />
          </div>
          <div className="relative -mt-14 px-6 text-center">
            <Image
              src={logo}
              alt="IK ALUMNI COLOR GUARD TEAM"
              priority
              className="mx-auto w-44 drop-shadow-lg"
            />
            <p
              className="mt-6 text-3xl leading-tight tracking-wider"
              style={{ fontFamily: "var(--font-academy)" }}
            >
              SUCCESS
              <br />
              <span className="text-xl text-white/70">or</span>
              <br />
              FAILURE ?
            </p>
            <h1 className="mt-4 text-xl font-bold">この企画、成功する? 失敗する?</h1>
            <p className="mt-2 text-sm text-white/70">
              あなたの予想に投票してください。
            </p>
          </div>
        </header>

        <main className="space-y-10 px-6 py-10">
          <section>
            <VoteClient initialCounts={counts} initialIsClosed={isClosed} />
          </section>

          <IconMarquee />

          <JoinCta />
        </main>

        <footer className="px-6 pb-10 text-center text-xs text-white/60">
          <p>© IK ALUMNI CGT</p>
        </footer>
      </div>
    </div>
  );
}
