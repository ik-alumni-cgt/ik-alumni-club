import { getVideo } from "@/data/video";
import { VideoForm } from "@/components/video-form";
import { getCategoriesTree, getVideoCategoryIds } from "@/data/category";
import { notFound } from "next/navigation";

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [video, categoriesTree, initialCategoryIds] = await Promise.all([
    getVideo(id),
    getCategoriesTree(),
    getVideoCategoryIds(id),
  ]);

  if (!video) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">動画編集</h1>
      <VideoForm
        defaultValues={video}
        categoriesTree={categoriesTree}
        initialCategoryIds={initialCategoryIds}
      />
    </div>
  );
}
