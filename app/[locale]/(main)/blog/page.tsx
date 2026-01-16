import { setLocale } from "@/app/web/i18n/set-locale";
import { BlogList } from "@/components/blog/list";
import { getPublicBlogs } from "@/data/blog";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const t = await getTranslations("Contents");
  const items = await getPublicBlogs();

  return (
    <div className="container mx-auto px-4 pt-10 pb-32">
      <h1 className="main-text mb-10">{t("blog")}</h1>
      <BlogList items={items} />
    </div>
  );
}
