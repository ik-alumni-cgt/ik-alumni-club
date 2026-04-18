import { getAllVideos } from "@/data/video";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ContentDataTable } from "@/components/admin/tables/content-data-table";
import type { ContentForTable } from "@/components/admin/tables/columns/content-columns";

export default async function AdminVideosPage() {
  const videos = await getAllVideos();

  const data: ContentForTable[] = videos.map((video) => ({
    id: video.id,
    title: video.title,
    published: video.published,
    isMemberOnly: video.isMemberOnly,
    updatedAt: video.updatedAt.toISOString(),
  }));

  return (
    <div>
      <ContentDataTable
        data={data}
        editBasePath="/admin/videos"
        toolbar={
          <Button asChild>
            <Link href="/admin/videos/new">新規作成</Link>
          </Button>
        }
        emptyState={{
          title: "動画がありません",
          action: (
            <Button asChild className="mt-2">
              <Link href="/admin/videos/new">新規作成</Link>
            </Button>
          ),
        }}
      />
    </div>
  );
}
