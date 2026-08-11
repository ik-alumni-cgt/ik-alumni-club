import Link from "next/link";
import Image from "next/image";
import { Lock, ImageIcon } from "lucide-react";
import { ScrollStagger } from "@/components/scroll-animation/scroll-stagger";
import type { PhotoLibraryGroup, PhotoLibraryWithImages } from "@/types/photo-library";

type CardProps = {
  href: string;
  title: string;
  thumbnailUrl?: string | null;
  countLabel?: string;
  metaLabel?: string;
  isMemberOnly?: boolean;
};

function PhotoLibraryCard({
  href,
  title,
  thumbnailUrl,
  countLabel,
  metaLabel,
  isMemberOnly,
}: CardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
    >
      <div className="relative w-full aspect-video bg-gray-200">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="h-16 w-16 text-white/50" />
          </div>
        )}
        {isMemberOnly && (
          <div className="absolute top-2 right-2 bg-amber-500/90 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
            <Lock className="h-3 w-3" />
            会員限定
          </div>
        )}
        {countLabel && (
          <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs font-medium">
            {countLabel}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
        {metaLabel && <span className="text-xs text-white/60">{metaLabel}</span>}
      </div>
    </Link>
  );
}

const getGroupThumbnailUrl = (group: PhotoLibraryGroup) => {
  const album = group.albums.find((a) => a.coverImageUrl || a.images[0]?.imageUrl);
  return album?.coverImageUrl || album?.images[0]?.imageUrl;
};

const getGroupImageCount = (group: PhotoLibraryGroup) =>
  group.albums.reduce((total, album) => total + album.images.length, 0);

export function PhotoLibraryList({
  items,
  groups = [],
}: {
  items: PhotoLibraryWithImages[];
  groups?: PhotoLibraryGroup[];
}) {
  return (
    <>
      {items.length === 0 && groups.length === 0 ? (
        <p className="text-center text-white/70">
          配信までしばらくお待ちください
        </p>
      ) : (
        <ScrollStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={100}>
        {groups.map((group) => (
          <PhotoLibraryCard
            key={group.slug}
            href={`/member/photo-library/category/${group.slug}`}
            title={group.title}
            thumbnailUrl={getGroupThumbnailUrl(group)}
            countLabel={`${group.albums.length}アルバム・${getGroupImageCount(group)}枚`}
            isMemberOnly
          />
        ))}
        {items.map((item) => (
          <PhotoLibraryCard
            key={item.id}
            href={`/photo-library/${item.id}`}
            title={item.title}
            thumbnailUrl={item.coverImageUrl || item.images[0]?.imageUrl}
            countLabel={item.images.length > 1 ? `${item.images.length}枚` : undefined}
            metaLabel={new Date(item.publishedAt ?? item.createdAt).toLocaleDateString("ja-JP")}
            isMemberOnly={item.isMemberOnly}
          />
        ))}
        </ScrollStagger>
      )}
    </>
  );
}
