"use client";

import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";
import { ScrollStagger } from "@/components/scroll-animation/scroll-stagger";

type PastEventItem = {
  id: string;
  title: string;
  description: string;
  eventDate: Date;
  imageUrl: string | null;
  published: boolean;
  isMemberOnly: boolean;
};

type TimelineGroup = {
  yearMonth: string;
  events: PastEventItem[];
};

function groupByYearMonth(events: PastEventItem[]): TimelineGroup[] {
  const groups = new Map<string, PastEventItem[]>();

  for (const event of events) {
    const date = new Date(event.eventDate);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(event);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, events]) => {
      const [year, month] = key.split("-").map(Number);
      return {
        yearMonth: `${year}年${month}月`,
        events: events.sort(
          (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
        ),
      };
    });
}

export function PastEventTimeline({ items }: { items: PastEventItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-center text-gray-500">
        過去のイベントはありません
      </p>
    );
  }

  const groups = groupByYearMonth(items);

  return (
    <div className="relative">
      <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

      {groups.map((group) => (
        <div key={group.yearMonth} className="mb-8">
          <div className="relative flex items-center mb-4">
            <div className="absolute left-4 md:left-8 w-3 h-3 bg-blue-600 rounded-full -translate-x-[5px]" />
            <h2 className="ml-10 md:ml-16 text-xl font-bold text-gray-800">
              {group.yearMonth}
            </h2>
          </div>

          <ScrollStagger
            className="ml-10 md:ml-16 space-y-4"
            staggerDelay={100}
          >
            {group.events.map((event) => (
              <Link
                key={event.id}
                href={`/past-events/${event.id}`}
                className="group flex gap-4 rounded-lg border p-4 hover:shadow-lg transition-shadow bg-white"
              >
                {event.imageUrl && (
                  <div className="relative w-32 h-24 md:w-48 md:h-32 flex-shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    {event.isMemberOnly && (
                      <div className="absolute top-1 right-1 bg-amber-500/90 text-white px-1.5 py-0.5 rounded text-xs flex items-center gap-0.5">
                        <Lock className="h-2.5 w-2.5" />
                        会員限定
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  {!event.imageUrl && event.isMemberOnly && (
                    <span className="inline-flex items-center gap-1 bg-amber-500/90 text-white px-2 py-0.5 rounded text-xs w-fit">
                      <Lock className="h-2.5 w-2.5" />
                      会員限定
                    </span>
                  )}
                  <div className="text-sm text-blue-600 font-medium">
                    {new Date(event.eventDate).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {event.description}
                  </p>
                </div>
              </Link>
            ))}
          </ScrollStagger>
        </div>
      ))}
    </div>
  );
}
