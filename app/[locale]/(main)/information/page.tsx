import { setLocale } from "@/app/web/i18n/set-locale";
import { InformationList } from "@/components/information/list";
import { InformationCategoryFilter } from "@/components/information/category-filter";
import { getInformations, getUsedInformationCategories } from "@/data/information";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function InformationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  await setLocale(params);
  const t = await getTranslations("Contents");
  const { category } = await searchParams;
  const [items, categories] = await Promise.all([
    getInformations(category),
    getUsedInformationCategories(),
  ]);

  return (
    <div className="container mx-auto px-4 pt-10 pb-32">
      <h1 className="main-text mb-10">{t("information")}</h1>
      <InformationCategoryFilter categories={categories} currentSlug={category} />
      <InformationList items={items} />
    </div>
  );
}
