import { cookies } from "next/headers";
import { setLocale } from "@/app/web/i18n/set-locale";
import { InformationContents } from "@/components/information/content";
import { BlogContents } from "@/components/blog/content";
import { NewsLettersContents } from "@/components/newsletters/content";
import { ScheduleContents } from "@/components/shedule/content";
import { HeroBgSlideshow } from "@/components/hero/hero-bg-slideshow";
import { VideoContents } from "@/components/video/content";
import { HeroCarousel } from "@/components/hero/hero-carousel";
import { AboutSection } from "@/components/hero/about-section";
import { SupportersContents } from "@/components/supporters/content";
import { MaintenancePage } from "@/components/maintenance/maintenance-page";

export const dynamic = 'force-dynamic';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  // プレビューモードの判定
  const isPreviewMode = process.env.PREVIEW_MODE === "true";
  if (isPreviewMode) {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get("preview_authenticated")?.value === "true";
    if (!isAuthenticated) {
      return <MaintenancePage />;
    }
  }

  return (
    <div className="font-sans max-w-full">
      <div className="relative w-full h-[60vh] md:h-auto mb-8 md:mb-12 lg:mb-16 bg-gradient-red pt-[156px] md:pt-[164px] pb-4 md:pb-8 -mt-[140px]">
        <HeroBgSlideshow />
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
