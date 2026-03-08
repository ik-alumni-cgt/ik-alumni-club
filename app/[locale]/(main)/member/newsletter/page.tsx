import { setLocale } from "@/app/web/i18n/set-locale";
import { NewsletterList } from "@/components/newsletters/list";
import { getMemberOnlyNewsletters } from "@/data/newsletter";
import { verifyActiveMember } from "@/lib/session";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function MemberNewsletterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await verifyActiveMember();
  await setLocale(params);
  const t = await getTranslations("Contents");
  const items = await getMemberOnlyNewsletters();

  return (
    <div className="bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-500 min-h-screen -mt-[140px] pt-[140px] text-white">
      <div className="container mx-auto px-4 pt-10 pb-32">
        <h1 className="main-text mb-10 text-white">{t("newsletters")}</h1>
        <NewsletterList items={items} />
      </div>
    </div>
  );
}
