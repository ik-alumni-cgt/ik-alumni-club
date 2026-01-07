import { setLocale } from "@/app/web/i18n/set-locale";
import { InformationContents } from "@/components/information/content";
import { BlogContents } from "@/components/blog/content";
import { NewsLettersContents } from "@/components/newsletters/content";
import { ScheduleContents } from "@/components/shedule/content";
import Image from "next/image";
import heroBg from "./hero-bg.jpg";
import { VideoContents } from "@/components/video/content";
import { HeroCarousel } from "@/components/hero/hero-carousel";
import { AboutSection } from "@/components/hero/about-section";
import { SupportersContents } from "@/components/supporters/content";

export const dynamic = 'force-dynamic';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  return (
    <div className="font-sans max-w-full">
      <div className="relative w-full mb-8 md:mb-12 lg:mb-16 bg-gradient-red pt-[156px] md:pt-[164px] pb-4 md:pb-8 -mt-[140px]">
        <Image
          src={heroBg}
          alt="Hero Background"
          className="w-full h-auto mx-auto px-4 md:px-8"
          priority
        />
      </div>
      <div className="mb-16 md:mb-32">
        <HeroCarousel />
      </div>
      {/* <AboutSection /> */}
      <div className="mb-16 md:mb-32">
        <div className="container mx-auto">
          <InformationContents />
        </div>
      </div>
      <div className="mb-16 md:mb-32 bg-gradient-red py-8 md:py-16">
        <main className="container mx-auto">
        <div className="mb-16 md:mb-32">
          <ScheduleContents />
        </div>
      </main>
      </div>
      <div className="mb-16 md:mb-32">
        <div className="container mx-auto">
          <VideoContents />
        </div>
        </div>
      <SupportersContents />
    </div>
  );
}
