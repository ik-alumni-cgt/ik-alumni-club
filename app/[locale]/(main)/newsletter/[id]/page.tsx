import { setLocale } from "@/app/web/i18n/set-locale";
import { NewsletterDetail } from "@/components/newsletters/detail";
import { getNewsletter } from "@/data/newsletter";
import { canAccessMemberContent } from "@/lib/session";
import { notFound } from "next/navigation";
import { MemberOnlyContent } from "@/components/member-only-content";

export const dynamic = 'force-dynamic';

export default async function NewsletterDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  await setLocale(params);
  const { id } = await params;
  const item = await getNewsletter(id);

  if (!item) {
    notFound();
  }

  // 会員限定コンテンツの場合、アクセス権限をチェック
  if (item.isMemberOnly) {
    const isMember = await canAccessMemberContent();
    if (!isMember) {
      return <MemberOnlyContent contentType="Digital Magazine" />;
    }
  }

  return (
    <div className="container max-w-full items-center justify-between pt-10 pb-32">
      <NewsletterDetail item={item} />
    </div>
  );
}
