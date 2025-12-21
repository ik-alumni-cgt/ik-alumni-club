import Link from "next/link";
import Image from "next/image";
import { Lock, ImageIcon } from "lucide-react";
import type { PhotoLibraryWithImages } from "@/types/photo-library";

export function PhotoLibraryList({ items }: { items: PhotoLibraryWithImages[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.length === 0 ? (
        <p className="col-span-full text-center text-gray-500">
          写真はありません
        </p>
      ) : (
        items.map((item) => {
          const thumbnailUrl = item.coverImageUrl || item.images[0]?.imageUrl;
          return (
            <Link
              key={item.id}
              href={`/photo-library/${item.id}`}
              className="group relative aspect-square rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
            >
              {thumbnailUrl ? (
                <Image
                  src={thumbnailUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
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
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <h3 className="font-semibold text-sm text-white line-clamp-1">
                  {item.title}
                </h3>
                <span className="text-xs text-white/80">
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
