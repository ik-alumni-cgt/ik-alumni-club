import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { DetailTitle } from "@/components/information/detail-title";

type Information = {
  id: string;
  title: string;
  date: string;
  content: string;
  imageUrl: string | null;
  url: string | null;
  published: boolean;
};

export function InformationDetail({ item }: { item: Information }) {
  return (
    <div className="flex flex-col gap-8">
      {/* タイトル・日付 */}
      <div className="flex flex-col gap-[10px]">
        <DetailTitle title={item.title} />
        <div className="text-[13px] text-gray-600">{formatDate(item.date)}</div>
      </div>

      {/* コンテンツ */}
      <div className="prose prose-lg max-w-none whitespace-pre-wrap">
        {item.content}
      </div>

      {/* URL */}
      {item.url && (
        <div>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline break-all"
          >
            {item.url}
          </a>
        </div>
      )}

      {/* 画像 */}
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

      {/* 戻るボタン */}
      <div className="mt-8 text-center">
        <Link
          href="/information"
          className="inline-block px-8 py-3 border-2 border-black text-black font-bold hover:bg-black hover:text-white transition-colors"
        >
          LIST
        </Link>
      </div>
    </div>
  );
}
