import { setLocale } from "@/app/web/i18n/set-locale";
import { InformationDetail } from "@/components/information/detail";
import { getInformation } from "@/data/information";
import { canAccessMemberContent } from "@/lib/session";
import { notFound } from "next/navigation";
import { MemberOnlyContent } from "@/components/member-only-content";

export const dynamic = 'force-dynamic';

export default async function InformationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  await setLocale(params);
  const { id } = await params;
  const item = await getInformation(id);

  if (!item) {
    notFound();
  }

  // 会員限定コンテンツの場合、アクセス権限をチェック
  if (item.isMemberOnly) {
    const isMember = await canAccessMemberContent();
    if (!isMember) {
      return <MemberOnlyContent contentType="お知らせ" />;
    }
  }

  return (
    <div className="pt-10 pb-32">
      <div className="container-detail mx-auto">
        <InformationDetail item={item} />
      </div>
    </div>
  );
}
