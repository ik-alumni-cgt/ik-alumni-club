import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";
import { ScrollStagger } from "@/components/scroll-animation/scroll-stagger";

type Blog = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string | null;
  published: boolean;
  isMemberOnly: boolean;
  authorName: string | null;
  publishedAt: Date | null;
  createdAt: Date;
};

export function BlogList({ items }: { items: Blog[] }) {
  return (
    <>
      {items.length === 0 ? (
        <p className="text-center text-gray-500">
          配信までしばらくお待ちください
        </p>
      ) : (
        <ScrollStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={100}>
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/blog/${item.id}`}
            className="group flex flex-col rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
          >
            {item.thumbnailUrl && (
              <div className="relative w-full aspect-video">
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                {item.isMemberOnly && (
                  <div className="absolute top-2 right-2 bg-amber-500/90 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    会員限定
                  </div>
                )}
              </div>
            )}
            <div className="p-4 flex flex-col gap-2 flex-1">
              {!item.thumbnailUrl && item.isMemberOnly && (
                <div className="mb-2">
                  <span className="inline-flex items-center gap-1 bg-amber-500/90 text-white px-2 py-1 rounded-md text-xs font-medium">
                    <Lock className="h-3 w-3" />
                    会員限定
                  </span>
                </div>
              )}
              <h3 className="font-semibold text-lg line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                {item.excerpt}
              </p>
              <div className="mt-auto pt-4 flex items-center justify-between text-xs text-gray-500">
                {item.authorName && <span>by {item.authorName}</span>}
                <span>
                  {new Date(item.publishedAt ?? item.createdAt).toLocaleDateString("ja-JP")}
                </span>
              </div>
            </div>
          </Link>
        ))}
        </ScrollStagger>
      )}
    </>
  );
}
