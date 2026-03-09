import Image from "next/image";

type PastEventItem = {
  id: string;
  title: string;
  description: string;
  eventDate: Date;
  imageUrl: string | null;
  published: boolean;
  authorName: string | null;
};

export function PastEventDetail({ item }: { item: PastEventItem }) {
  return (
    <article className="flex flex-col gap-8 max-w-4xl mx-auto">
      <header>
        <div className="text-sm font-medium text-blue-600 mb-2">
          {new Date(item.eventDate).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl mb-4">{item.title}</h1>
        {item.authorName && (
          <div className="text-sm text-gray-600">投稿者: {item.authorName}</div>
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
        {item.description}
      </div>
    </article>
  );
}
