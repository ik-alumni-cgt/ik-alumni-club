import { ContentsHeader } from "@/components/contents/contents-header";
import { ContentsCard } from "@/components/contents/contents-card";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { getLatestNewsletters } from "@/data/newsletter";
import { getRecentVideos } from "@/data/video";
import { getRecentPhotos } from "@/data/photo-library";

const formatDate = (date: Date | string | null) => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
};

export async function NewContents() {
  const t = await getTranslations("Contents");

  const [newsletters, videos, photos] = await Promise.all([
    getLatestNewsletters(1),
    getRecentVideos(1),
    getRecentPhotos(1),
  ]);

  const newItems = [
    newsletters[0] && {
      id: newsletters[0].id,
      title: newsletters[0].title,
      date: formatDate(newsletters[0].publishedAt ?? newsletters[0].createdAt),
      imageUrl: newsletters[0].thumbnailUrl,
      category: "Digital Magazine",
      href: `/newsletter/${newsletters[0].id}`,
    },
    videos[0] && {
      id: videos[0].id,
      title: videos[0].title,
      date: formatDate(videos[0].videoDate),
      imageUrl: videos[0].thumbnailUrl,
      category: "Video",
      href: `/video/${videos[0].id}`,
    },
    photos[0] && {
      id: photos[0].id,
      title: photos[0].title,
      date: formatDate(photos[0].createdAt),
      imageUrl: photos[0].coverImageUrl ?? photos[0].images?.[0]?.imageUrl,
      category: "Photo",
      href: `/photo-library/${photos[0].id}`,
    },
  ].filter(Boolean);

  return (
    <div className="flex flex-col text-white">
      <ContentsHeader title="New Content" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-[60px]">
        {newItems.length === 0 ? (
          <p>配信までしばらくお待ちください</p>
        ) : (
          newItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                    {item.category}
                  </h3>
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-700">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                </div>
                <ContentsCard title={item.title} date={item.date} />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
