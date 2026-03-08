import Link from "next/link";
import Image from "next/image";
import { Lock, ImageIcon } from "lucide-react";
import type { PhotoLibraryWithImages } from "@/types/photo-library";

export function PhotoLibraryList({ items }: { items: PhotoLibraryWithImages[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.length === 0 ? (
        <p className="col-span-full text-center text-white/70">
          配信までしばらくお待ちください
        </p>
      ) : (
        items.map((item) => {
          const thumbnailUrl = item.coverImageUrl || item.images[0]?.imageUrl;
          return (
            <Link
              key={item.id}
              href={`/photo-library/${item.id}`}
              className="group flex flex-col rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full aspect-video bg-gray-200">
                {thumbnailUrl ? (
                  <Image
                    src={thumbnailUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-white/50" />
                  </div>
                )}
                {item.isMemberOnly && (
                  <div className="absolute top-2 right-2 bg-amber-500/90 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    会員限定
                  </div>
                )}
                {item.images.length > 1 && (
                  <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs font-medium">
                    {item.images.length}枚
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-lg line-clamp-2">
                  {item.title}
                </h3>
                <span className="text-xs text-white/60">
                  {new Date(item.createdAt).toLocaleDateString("ja-JP")}
                </span>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
}
