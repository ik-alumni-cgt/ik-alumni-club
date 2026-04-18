import { ScheduleForm } from "@/components/schedule-form";
import { getCategoriesTree } from "@/data/category";

export default async function NewSchedulePage() {
  const categoriesTree = await getCategoriesTree();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">スケジュール新規作成</h1>
      <ScheduleForm categoriesTree={categoriesTree} />
    </div>
  );
}
