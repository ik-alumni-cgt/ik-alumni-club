import { getSchedule } from "@/data/schedule";
import { ScheduleForm } from "@/components/schedule-form";
import { getCategoriesTree, getScheduleCategoryIds } from "@/data/category";
import { notFound } from "next/navigation";

export default async function EditSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [schedule, categoriesTree, initialCategoryIds] = await Promise.all([
    getSchedule(id),
    getCategoriesTree(),
    getScheduleCategoryIds(id),
  ]);

  if (!schedule) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">スケジュール編集</h1>
      <ScheduleForm
        defaultValues={schedule}
        categoriesTree={categoriesTree}
        initialCategoryIds={initialCategoryIds}
      />
    </div>
  );
}
