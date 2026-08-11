import { setLocale } from "@/app/web/i18n/set-locale";
import { PhotoLibraryList } from "@/components/photo-library/list";
import { getPhotoLibraryGroup } from "@/data/photo-library";
import { verifyActiveMember } from "@/lib/session";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MemberPhotoLibraryCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  await verifyActiveMember();
  await setLocale(params);
  const { slug } = await params;
  const group = await getPhotoLibraryGroup(slug);

  if (!group) {
    notFound();
  }

  return (
    <div className="bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-500 min-h-screen -mt-[140px] pt-[140px] text-white">
      <div className="container mx-auto px-4 pt-10 pb-32">
        <Link
          href="/member/photo-library"
          className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          フォトライブラリ一覧へ戻る
        </Link>
        <h1 className="main-text mb-10 text-white">{group.title}</h1>
        <PhotoLibraryList items={group.albums} />
      </div>
    </div>
  );
}
