import { Button } from "@/components/ui/button";
import { getAllPhotos } from "@/data/photo-library";

import Link from "next/link";
import { ContentDataTable } from "@/components/admin/tables/content-data-table";
import type { ContentForTable } from "@/components/admin/tables/columns/content-columns";

export default async function AdminPhotoLibraryPage() {
  const photos = await getAllPhotos();

  const data: ContentForTable[] = photos.map((photo) => ({
    id: photo.id,
    title: photo.title,
    published: photo.published,
    isMemberOnly: photo.isMemberOnly,
    updatedAt: photo.updatedAt.toISOString(),
    imageUrl: photo.coverImageUrl,
    categories: photo.photoLibraryCategories.map((pc) => ({
      id: pc.category.id,
      name: pc.category.name,
    })),
  }));

  return (
    <div>
      <ContentDataTable
        data={data}
        editBasePath="/admin/photo-library"
        toolbar={
          <Button asChild>
            <Link href="/admin/photo-library/new">
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
                新規作成
              </Link>
            </Button>
          ),
        }}
      />
    </div>
  );
}
