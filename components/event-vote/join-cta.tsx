import Image from "next/image";
import Link from "next/link";
import supportersClubIcon from "@/components/supporters/supporters-club-icon.png";
import { Button } from "@/components/ui/button";

const BENEFITS = [
  "会員限定グッズ",
  "コンサート映像の配信",
  "会員ページ限定コンテンツ",
  "コンサート優先入場権",
] as const;

export const JoinCta = () => {
  return (
    <section className="rounded-3xl bg-white px-6 py-8 text-center text-[#14166b] shadow-xl">
      <Image
        src={supportersClubIcon}
        alt="IK ALUMNI COLOR GUARD TEAM SUPPORTER'S CLUB"
        className="mx-auto size-32"
      />
      <h2 className="mt-4 text-xl font-bold">
        後援会に入って、
        <br />
        一緒にチームを応援しませんか
      </h2>
      <p className="mt-3 text-sm text-[#14166b]/80">
        いただいたご支援は、公演や日々の活動に活かされます。
      </p>
      <ul className="mt-5 space-y-2 text-sm font-bold">
        {BENEFITS.map((benefit) => (
          <li key={benefit} className="rounded-full bg-[#14166b]/5 py-2">
            {benefit}
          </li>
        ))}
      </ul>
      <Link href="/supporters" className="mt-6 block">
        <Button className="h-14 w-full rounded-full bg-[#e60012] text-lg font-bold text-white hover:bg-[#c4000f]">
          入会案内を見る
        </Button>
      </Link>
    </section>
  );
};
