import { PhotoLibraryForm } from "@/components/photo-library-form";
import { PhotoLibraryCard } from "@/components/photo-library-card";
import { DeletePhotoLibraryButton } from "@/components/delete-photo-library-button";
import { Button } from "@/components/ui/button";
import { getPhoto } from "@/data/photo-library";
import { getCategoriesTree, getPhotoLibraryCategoryIds } from "@/data/category";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditPhotoLibraryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [photo, categoriesTree, initialCategoryIds] = await Promise.all([
    getPhoto(id),
    getCategoriesTree(),
    getPhotoLibraryCategoryIds(id),
  ]);

  if (!photo) {
    notFound();
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/photo-library">
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">フォト編集</h1>
        <p className="text-muted-foreground">フォトを編集します</p>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">プレビュー</h2>
        <PhotoLibraryCard photo={photo} isAdmin={true} />
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">編集</h2>
        <PhotoLibraryForm
          mode="edit"
          defaultValues={{
            id: photo.id,
            title: photo.title,
            description: photo.description || "",
            coverImageUrl: photo.coverImageUrl || "",
            publishedAt: photo.publishedAt
              ? photo.publishedAt.toISOString().split("T")[0]
              : "",
            published: photo.published,
            isMemberOnly: photo.isMemberOnly,
            images: photo.images.map((img) => ({
              imageUrl: img.imageUrl,
              caption: img.caption || "",
            })),
          }}
          categoriesTree={categoriesTree}
          initialCategoryIds={initialCategoryIds}
        />
      </div>

      <div className="border-t pt-6">
        <h2 className="mb-3 text-lg font-semibold text-destructive">
          危険な操作
        </h2>
        <DeletePhotoLibraryButton photoId={photo.id} photoTitle={photo.title} />
      </div>
    </div>
  );
}
