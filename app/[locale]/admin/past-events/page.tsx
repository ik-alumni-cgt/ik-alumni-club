import { getAllPastEvents } from "@/data/past-event";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import {
  pastEventsColumns,
  type PastEventForTable,
} from "@/components/admin/tables/columns/past-events-columns";

export default async function AdminPastEventsPage() {
  const pastEvents = await getAllPastEvents();

  const data: PastEventForTable[] = pastEvents.map((pastEvent) => ({
    id: pastEvent.id,
    title: pastEvent.title,
    eventDate: pastEvent.eventDate.toISOString(),
    imageUrl: pastEvent.imageUrl,
    published: pastEvent.published,
    isMemberOnly: pastEvent.isMemberOnly,
  }));

  return (
    <div>
      <DataTable
        columns={pastEventsColumns}
        data={data}
        searchKey="title"
        searchPlaceholder="タイトルで検索..."
        toolbar={
          <Button asChild>
            <Link href="/admin/past-events/new">新規作成</Link>
          </Button>
        }
        emptyState={{
          title: "過去のイベントがありません",
          action: (
            <Button asChild className="mt-2">
              <Link href="/admin/past-events/new">新規作成</Link>
            </Button>
          ),
        }}
      />
    </div>
  );
}
