import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";

interface ShortsItem {
  id: string;
  videoUrl: string;
  title: string;
  thumbnailUrl: string | null;
  isMemberOnly: boolean;
}

interface ShortsListProps {
  items: ShortsItem[];
}

function getEmbedUrl(url: string): string {
  // Instagram Reel
  const reelMatch = url.match(/instagram\.com\/reel\/([^/?]+)/);
  if (reelMatch) {
    return `https://www.instagram.com/reel/${reelMatch[1]}/embed/`;
  }

  // YouTube (Shorts, watch, embed, etc.)
  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=|\/shorts\/))([^&?\/#]+)/
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  return url;
}

export function ShortsList({ items }: ShortsListProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 md:gap-6 pb-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 flex flex-col items-center gap-3"
          >
            <div className="relative w-[200px] sm:w-[220px] md:w-[240px] aspect-[9/16]">
              {item.isMemberOnly ? (
                <Link
                  href={`/video/${item.id}`}
                  className="group absolute inset-0 rounded-lg overflow-hidden bg-gray-200 block"
                >
                  {item.thumbnailUrl ? (
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-500" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 text-white">
                    <Lock className="h-10 w-10" />
                    <span className="text-sm font-medium">会員限定</span>
                  </div>
                  <div className="absolute top-2 right-2 bg-amber-500/90 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    会員限定
                  </div>
                </Link>
              ) : (
                <iframe
                  className="absolute inset-0 w-full h-full rounded-lg"
                  src={getEmbedUrl(item.videoUrl)}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            <div className="text-xs md:text-sm text-center w-[200px] sm:w-[220px] md:w-[240px] truncate">
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
