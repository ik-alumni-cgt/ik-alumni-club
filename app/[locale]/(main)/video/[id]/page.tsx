import { setLocale } from "@/app/web/i18n/set-locale";
import { VideoDetail } from "@/components/video/detail";
import { LikeButton } from "@/components/like-button";
import { getVideo } from "@/data/video";
import { getReactionCounts } from "@/data/like";
import { canAccessMemberContent } from "@/lib/session";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { MemberOnlyContent } from "@/components/member-only-content";

export const dynamic = 'force-dynamic';

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  await setLocale(params);
  const { id } = await params;
  const item = await getVideo(id);

  if (!item) {
    notFound();
  }

  // 会員限定コンテンツの場合、アクセス権限をチェック
  if (item.isMemberOnly) {
    const isMember = await canAccessMemberContent();
    if (!isMember) {
      return <MemberOnlyContent contentType="動画" />;
    }
  }

  const reactionCounts = await getReactionCounts("video", id);
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className={`min-h-screen -mt-[140px] pt-[140px] ${item.isMemberOnly ? "bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-500 text-white" : "bg-white text-gray-900"}`}>
      <div className="container max-w-full items-center justify-between pt-10 pb-32">
        <VideoDetail item={item} />
        <div className="flex justify-center mt-8">
          <LikeButton contentType="video" contentId={id} initialReactionCounts={reactionCounts} userId={session?.user?.id} />
        </div>
      </div>
    </div>
  );
}
