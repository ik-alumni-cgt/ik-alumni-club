import Image from "next/image";
import { BlogContent } from "./blog-content";

type Blog = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string | null;
  published: boolean;
  authorName: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export function BlogDetail({ item }: { item: Blog }) {
  return (
    <article className="flex flex-col gap-8 max-w-4xl mx-auto">
      <header>
        <h1 className="text-2xl md:text-3xl lg:text-4xl mb-4">{item.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {item.authorName && <span>著者: {item.authorName}</span>}
          <span>{new Date(item.publishedAt ?? item.createdAt).toLocaleDateString("ja-JP")}</span>
        </div>
      </header>

      {item.thumbnailUrl && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <Image
            src={item.thumbnailUrl}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-700 mb-8">{item.excerpt}</p>
        <BlogContent html={item.content} />
      </div>
    </article>
  );
}
