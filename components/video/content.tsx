import { getRecentVideos, getRecentShorts } from "@/data/video";
import { getTranslations } from "next-intl/server";
import { VideoSection } from "./video-section";

export async function VideoContents() {
  const t = await getTranslations("Contents");

  const [videos, shorts] = await Promise.all([
    getRecentVideos(5),
    getRecentShorts(5),
  ]);

  const videoItems = videos.map((video) => ({
    videoUrl: video.videoUrl,
    title: video.title,
  }));

  const shortsItems = shorts.map((short) => ({
    id: short.id,
    videoUrl: short.videoUrl,
    title: short.title,
    thumbnailUrl: short.thumbnailUrl,
    isMemberOnly: short.isMemberOnly,
  }));

  return (
    <VideoSection
      title={t("video")}
      videoItems={videoItems}
      shortsItems={shortsItems}
    />
  );
}
