import { getAllPastEvents } from "@/data/past-event";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ContentDataTable } from "@/components/admin/tables/content-data-table";
import type { ContentForTable } from "@/components/admin/tables/columns/content-columns";

export default async function AdminPastEventsPage() {
  const pastEvents = await getAllPastEvents();

  const data: ContentForTable[] = pastEvents.map((pastEvent) => ({
    id: pastEvent.id,
    title: pastEvent.title,
    published: pastEvent.published,
    isMemberOnly: pastEvent.isMemberOnly,
    updatedAt: pastEvent.updatedAt.toISOString(),
  }));

  return (
    <div>
      <ContentDataTable
        data={data}
        editBasePath="/admin/past-events"
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
