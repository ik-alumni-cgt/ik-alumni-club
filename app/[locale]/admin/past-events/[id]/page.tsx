import { getPastEvent } from "@/data/past-event";
import { PastEventForm } from "@/components/past-event-form";
import { DeletePastEventButton } from "@/components/delete-past-event-button";
import { getCategoriesTree, getPastEventCategoryIds } from "@/data/category";
import { notFound } from "next/navigation";

export default async function EditPastEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [pastEvent, categoriesTree, initialCategoryIds] = await Promise.all([
    getPastEvent(id),
    getCategoriesTree(),
    getPastEventCategoryIds(id),
  ]);

  if (!pastEvent) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">過去のイベント編集</h1>
        <DeletePastEventButton
          pastEventId={pastEvent.id}
          pastEventTitle={pastEvent.title}
        />
      </div>
      <PastEventForm
        defaultValues={pastEvent}
        categoriesTree={categoriesTree}
        initialCategoryIds={initialCategoryIds}
      />
    </div>
  );
}
