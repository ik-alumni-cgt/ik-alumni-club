import { setLocale } from "@/app/web/i18n/set-locale";
import { PhotoLibraryDetail } from "@/components/photo-library/detail";
import { getPhoto } from "@/data/photo-library";
import { canAccessMemberContent } from "@/lib/session";
import { notFound } from "next/navigation";
import { MemberOnlyContent } from "@/components/member-only-content";

export const dynamic = 'force-dynamic';

export default async function PhotoLibraryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  await setLocale(params);
  const { id } = await params;
  const item = await getPhoto(id);

  if (!item) {
    notFound();
  }

  // 会員限定コンテンツの場合、アクセス権限をチェック
  if (item.isMemberOnly) {
    const isMember = await canAccessMemberContent();
    if (!isMember) {
      return <MemberOnlyContent contentType="フォト" />;
    }
  }

  return (
    <div className="container max-w-full items-center justify-between pt-10 pb-32">
      <PhotoLibraryDetail item={item} />
    </div>
  );
}
