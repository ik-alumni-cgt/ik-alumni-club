import { setLocale } from "@/app/web/i18n/set-locale";
import { VideoList } from "@/components/video/list";
import { getMemberOnlyVideos } from "@/data/video";
import { verifyActiveMember } from "@/lib/session";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function MemberVideoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await verifyActiveMember();
  await setLocale(params);
  const t = await getTranslations("Contents");
  const items = await getMemberOnlyVideos();

  return (
    <div className="bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-500 min-h-screen -mt-[140px] pt-[140px]">
      <div className="container mx-auto px-4 pt-10 pb-32">
        <h1 className="main-text mb-10 text-white">{t("video")}</h1>
        <VideoList items={items} />
      </div>
    </div>
  );
}
