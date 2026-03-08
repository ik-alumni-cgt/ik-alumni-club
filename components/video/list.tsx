import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";

type Video = {
  id: string;
  title: string;
  videoDate: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  published: boolean;
  isMemberOnly: boolean;
  authorName: string | null;
  viewCount: number;
};

export function VideoList({ items }: { items: Video[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.length === 0 ? (
        <p className="col-span-full text-center text-white/70">
          配信までしばらくお待ちください
        </p>
      ) : (
        items.map((item) => (
          <Link
            key={item.id}
            href={`/video/${item.id}`}
            className="group flex flex-col rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
          >
            <div className="relative w-full aspect-video bg-gray-200">
              {item.thumbnailUrl ? (
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-white/50"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                </div>
              )}
              {item.isMemberOnly && (
                <div className="absolute top-2 right-2 bg-amber-500/90 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  会員限定
                </div>
              )}
            </div>
            <div className="p-4 flex flex-col gap-2">
              <h3 className="font-semibold text-lg line-clamp-2">
                {item.title}
              </h3>
              <div className="text-xs text-white/60">
                <span>{new Date(item.videoDate).toLocaleDateString("ja-JP")}</span>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
