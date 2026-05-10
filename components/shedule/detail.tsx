import Image from "next/image";

type Schedule = {
  id: string;
  title: string;
  content: string;
  eventDate: Date;
  imageUrl: string | null;
  linkUrl: string | null;
  sortOrder: number;
  published: boolean;
  authorName: string | null;
};

export function ScheduleDetail({ item }: { item: Schedule }) {
  return (
    <article className="flex flex-col gap-8 max-w-4xl mx-auto">
      <header>
        <div className="text-sm font-medium text-blue-600 mb-2">
          {new Date(item.eventDate).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl mb-4">{item.title}</h1>
        {item.authorName && (
          <div className="text-sm text-gray-600">
            主催者: {item.authorName}
          </div>
        )}
      </header>

      {item.imageUrl && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none whitespace-pre-wrap">
        {item.content}
      </div>

      {item.linkUrl && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <a
            href={item.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            詳細はこちら
          </a>
        </div>
      )}
    </article>
  );
}
