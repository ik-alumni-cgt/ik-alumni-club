import { setLocale } from "@/app/web/i18n/set-locale";
import { BlogDetail } from "@/components/blog/detail";
import { LikeButton } from "@/components/like-button";
import { getBlog } from "@/data/blog";
import { getReactionCounts } from "@/data/like";
import { canAccessMemberContent } from "@/lib/session";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { MemberOnlyContent } from "@/components/member-only-content";

export const dynamic = 'force-dynamic';

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  await setLocale(params);
  const { id } = await params;
  const item = await getBlog(id);

  if (!item) {
    notFound();
  }

  // 会員限定コンテンツの場合、アクセス権限をチェック
  if (item.isMemberOnly) {
    const isMember = await canAccessMemberContent();
    if (!isMember) {
      return <MemberOnlyContent contentType="ブログ" />;
    }
  }

  const reactionCounts = await getReactionCounts("blog", id);
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="container max-w-full items-center justify-between pt-10 pb-32">
      <BlogDetail item={item} />
      <div className="flex justify-center mt-8">
        <LikeButton contentType="blog" contentId={id} initialReactionCounts={reactionCounts} userId={session?.user?.id} />
      </div>
    </div>
  );
}
