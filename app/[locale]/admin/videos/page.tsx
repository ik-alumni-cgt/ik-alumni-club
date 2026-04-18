import { getAllVideos } from "@/data/video";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import {
  videosColumns,
  type VideoForTable,
} from "@/components/admin/tables/columns/videos-columns";

export default async function AdminVideosPage() {
  const videos = await getAllVideos();

  const data: VideoForTable[] = videos.map((video) => ({
    id: video.id,
    title: video.title,
    thumbnailUrl: video.thumbnailUrl,
    published: video.published,
    isMemberOnly: video.isMemberOnly,
    authorName: video.authorName,
    videoDate: video.videoDate,
  }));

  return (
    <div className="container">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">動画管理</h1>
          <p className="text-muted-foreground">
            動画の作成・編集・削除ができます
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/videos/new">新規作成</Link>
        </Button>
      </div>

      <DataTable
        columns={videosColumns}
        data={data}
        searchKey="title"
        searchPlaceholder="タイトルで検索..."
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
