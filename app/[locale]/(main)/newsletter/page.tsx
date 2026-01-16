import { setLocale } from "@/app/web/i18n/set-locale";
import { NewsletterList } from "@/components/newsletters/list";
import { getPublicNewsletters } from "@/data/newsletter";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function NewsletterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const t = await getTranslations("Contents");
  const items = await getPublicNewsletters();

  return (
    <div className="container mx-auto px-4 pt-10 pb-32">
      <h1 className="main-text mb-10">{t("newsletters")}</h1>
      <NewsletterList items={items} />
    </div>
  );
}
