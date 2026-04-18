import { Button } from "@/components/ui/button";
import { getAllPhotos } from "@/data/photo-library";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import {
  photoLibraryColumns,
  type PhotoLibraryForTable,
} from "@/components/admin/tables/columns/photo-library-columns";

export default async function AdminPhotoLibraryPage() {
  const photos = await getAllPhotos();

  const data: PhotoLibraryForTable[] = photos.map((photo) => ({
    id: photo.id,
    title: photo.title,
    thumbnailUrl: photo.coverImageUrl || photo.images[0]?.imageUrl || null,
    imageCount: photo.images.length,
    published: photo.published,
    isMemberOnly: photo.isMemberOnly,
    createdAt: photo.createdAt.toISOString(),
  }));

  return (
    <div>
      <DataTable
        columns={photoLibraryColumns}
        data={data}
        searchKey="title"
        searchPlaceholder="タイトルで検索..."
        toolbar={
          <Button asChild>
            <Link href="/admin/photo-library/new">
              <Plus className="mr-2 h-4 w-4" />
              新規作成
            </Link>
          </Button>
        }
        emptyState={{
          title: "フォトがありません",
          description: "新しいフォトを追加してください",
          action: (
            <Button asChild className="mt-2">
              <Link href="/admin/photo-library/new">
                <Plus className="mr-2 h-4 w-4" />
                新規作成
              </Link>
            </Button>
          ),
        }}
      />
    </div>
  );
}
