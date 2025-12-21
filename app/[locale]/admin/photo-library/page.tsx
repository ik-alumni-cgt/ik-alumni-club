import { PhotoLibraryCard } from "@/components/photo-library-card";
import { Button } from "@/components/ui/button";
import { getAllPhotos } from "@/data/photo-library";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function AdminPhotoLibraryPage() {
  const photos = await getAllPhotos();

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">フォトライブラリ管理</h1>
          <p className="text-muted-foreground">
            フォトの作成・編集・削除ができます
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/photo-library/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </div>

      {photos.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">フォトがありません</h3>
            <p className="text-sm text-muted-foreground">
              新しいフォトを追加してください
            </p>
            <Button asChild className="mt-4">
              <Link href="/admin/photo-library/new">
                <Plus className="mr-2 h-4 w-4" />
                新規作成
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <PhotoLibraryCard key={photo.id} photo={photo} isAdmin={true} />
          ))}
        </div>
      )}
    </div>
  );
}
