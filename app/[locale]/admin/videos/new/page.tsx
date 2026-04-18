import { VideoForm } from "@/components/video-form";
import { getCategoriesTree } from "@/data/category";

export default async function NewVideoPage() {
  const categoriesTree = await getCategoriesTree();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">動画新規作成</h1>
      <VideoForm categoriesTree={categoriesTree} />
    </div>
  );
}
