import { setLocale } from "@/app/web/i18n/set-locale";
import { VideoListPage } from "@/components/video/video-list-page";
import { getPublicVideos, getPublicShorts } from "@/data/video";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const t = await getTranslations("Contents");

  const [videoItems, shorts] = await Promise.all([
    getPublicVideos(),
    getPublicShorts(),
  ]);

  const shortsItems = shorts.map((short) => ({
    videoUrl: short.videoUrl,
    title: short.title,
  }));

  return (
    <div className="container mx-auto px-4 pt-10 pb-32">
      <h1 className="main-text mb-10">{t("video")}</h1>
      <VideoListPage videoItems={videoItems} shortsItems={shortsItems} />
    </div>
  );
}
