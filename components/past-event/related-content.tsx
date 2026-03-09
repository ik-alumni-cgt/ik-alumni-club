import Link from "next/link";
import Image from "next/image";
import { Lock, FileText, Video, Newspaper, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RelatedContentItem } from "@/data/category";

const CONTENT_TYPE_CONFIG = {
  blog: {
    label: "BLOG",
    href: (id: string) => `/blog/${id}`,
    icon: FileText,
    color: "bg-emerald-500",
  },
  video: {
    label: "VIDEO",
    href: (id: string) => `/video/${id}`,
    icon: Video,
    color: "bg-blue-500",
  },
  information: {
    label: "INFO",
    href: (id: string) => `/information/${id}`,
    icon: Newspaper,
    color: "bg-orange-500",
  },
  schedule: {
    label: "SCHEDULE",
    href: (id: string) => `/schedule/${id}`,
    icon: CalendarDays,
    color: "bg-purple-500",
  },
} as const;

export function RelatedContent({ items }: { items: RelatedContentItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto mt-12">
      <h2 className="text-xl font-bold mb-6 border-b pb-2">関連コンテンツ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const config = CONTENT_TYPE_CONFIG[item.contentType];
          const Icon = config.icon;

          return (
            <Link
              key={`${item.contentType}-${item.id}`}
              href={config.href(item.id)}
              className="group flex flex-col rounded-lg border hover:shadow-lg transition-shadow bg-white overflow-hidden"
            >
              {item.thumbnailUrl ? (
                <div className="relative w-full aspect-video">
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  {item.isMemberOnly && (
                    <div className="absolute top-2 right-2 bg-amber-500/90 text-white px-1.5 py-0.5 rounded text-xs flex items-center gap-0.5">
                      <Lock className="h-2.5 w-2.5" />
                      会員限定
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative w-full aspect-video bg-gray-100 flex items-center justify-center">
                  <Icon className="h-10 w-10 text-gray-300" />
                  {item.isMemberOnly && (
                    <div className="absolute top-2 right-2 bg-amber-500/90 text-white px-1.5 py-0.5 rounded text-xs flex items-center gap-0.5">
                      <Lock className="h-2.5 w-2.5" />
                      会員限定
                    </div>
                  )}
                </div>
              )}
              <div className="p-3 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Badge className={`${config.color} text-white text-xs`}>
                    {config.label}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {item.date.toLocaleDateString("ja-JP")}
                  </span>
                </div>
                <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
