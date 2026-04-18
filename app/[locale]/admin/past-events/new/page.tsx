import { PastEventForm } from "@/components/past-event-form";
import { getCategoriesTree } from "@/data/category";

export default async function NewPastEventPage() {
  const categoriesTree = await getCategoriesTree();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">過去のイベント新規作成</h1>
      <PastEventForm categoriesTree={categoriesTree} />
    </div>
  );
}
