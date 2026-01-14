import { setLocale } from "@/app/web/i18n/set-locale";
import { BlogList } from "@/components/blog/list";
import { getMemberOnlyBlogs } from "@/data/blog";
import { verifyActiveMember } from "@/lib/session";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function MemberBlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await verifyActiveMember();
  await setLocale(params);
  const t = await getTranslations("Contents");
  const items = await getMemberOnlyBlogs();

  return (
    <div className="bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-500 min-h-screen -mt-[140px] pt-[140px]">
      <div className="container mx-auto px-4 pt-10 pb-32">
        <h1 className="main-text mb-10 text-white">{t("blog")}</h1>
        <BlogList items={items} />
      </div>
    </div>
  );
}
