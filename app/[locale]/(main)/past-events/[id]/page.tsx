import { setLocale } from "@/app/web/i18n/set-locale";
import { PastEventDetail } from "@/components/past-event/detail";
import { RelatedContent } from "@/components/past-event/related-content";
import { getPastEvent } from "@/data/past-event";
import { getPastEventCategoryIds, getRelatedContentByCategoryIds } from "@/data/category";
import { canAccessMemberContent } from "@/lib/session";
import { notFound } from "next/navigation";
import { MemberOnlyContent } from "@/components/member-only-content";

export const dynamic = "force-dynamic";

export default async function PastEventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  await setLocale(params);
  const { id } = await params;
  const item = await getPastEvent(id);

  if (!item) {
    notFound();
  }

  if (item.isMemberOnly) {
    const isMember = await canAccessMemberContent();
    if (!isMember) {
      return <MemberOnlyContent contentType="過去のイベント" />;
    }
  }

  const categoryIds = await getPastEventCategoryIds(id);
  const relatedContent = await getRelatedContentByCategoryIds(categoryIds);

  return (
    <div className="container max-w-full items-center justify-between pt-10 pb-32">
      <PastEventDetail item={item} />
      <RelatedContent items={relatedContent} />
    </div>
  );
}
