import { setLocale } from "@/app/web/i18n/set-locale";
import { PhotoLibraryList } from "@/components/photo-library/list";
import { getPublishedPhotos } from "@/data/photo-library";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function PhotoLibraryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const t = await getTranslations("Contents");
  const items = await getPublishedPhotos();

  return (
    <div className="container mx-auto px-4 pt-10 pb-32">
      <h1 className="main-text mb-10">{t("photoLibrary")}</h1>
      <PhotoLibraryList items={items} />
    </div>
  );
}
