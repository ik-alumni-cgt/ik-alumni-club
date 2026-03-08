import { setLocale } from "@/app/web/i18n/set-locale";
import { NewsletterDetail } from "@/components/newsletters/detail";
import { LikeButton } from "@/components/like-button";
import { getNewsletter } from "@/data/newsletter";
import { getReactionCounts } from "@/data/like";
import { canAccessMemberContent } from "@/lib/session";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
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

  const reactionCounts = await getReactionCounts("newsletter", id);
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-500 min-h-screen -mt-[140px] pt-[140px] text-white">
      <div className="container max-w-full items-center justify-between pt-10 pb-32">
        <NewsletterDetail item={item} />
        <div className="flex justify-center mt-8">
          <LikeButton contentType="newsletter" contentId={id} initialReactionCounts={reactionCounts} userId={session?.user?.id} />
        </div>
      </div>
    </div>
  );
}
