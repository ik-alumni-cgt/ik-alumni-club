import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";
import { ScrollStagger } from "@/components/scroll-animation/scroll-stagger";

type Schedule = {
  id: string;
  title: string;
  content: string;
  eventDate: Date;
  imageUrl: string | null;
  linkUrl: string | null;
  sortOrder: number;
  published: boolean;
  isMemberOnly: boolean;
  authorName: string | null;
};

export function ScheduleList({ items }: { items: Schedule[] }) {
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
            href={`/schedule/${item.id}`}
            className="group flex flex-col rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
          >
            <div className="relative w-full aspect-video bg-gray-200">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
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
            <div className="p-4 flex flex-col gap-2 flex-1">
              <div className="text-sm font-medium text-blue-600">
                {new Date(item.eventDate).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "short",
                })}
              </div>
              <h3 className="font-semibold text-lg line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                {item.content}
              </p>
            </div>
          </Link>
        ))}
        </ScrollStagger>
      )}
    </>
  );
}
