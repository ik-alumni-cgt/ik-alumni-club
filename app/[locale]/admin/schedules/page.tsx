import { getAllSchedules } from "@/data/schedule";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import {
  schedulesColumns,
  type ScheduleForTable,
} from "@/components/admin/tables/columns/schedules-columns";

export default async function AdminSchedulesPage() {
  const schedules = await getAllSchedules();

  const data: ScheduleForTable[] = schedules.map((schedule) => ({
    id: schedule.id,
    title: schedule.title,
    eventDate: schedule.eventDate.toISOString(),
    imageUrl: schedule.imageUrl,
    linkUrl: schedule.linkUrl,
    sortOrder: schedule.sortOrder,
    published: schedule.published,
    isMemberOnly: schedule.isMemberOnly,
  }));

  return (
    <div>
      <DataTable
        columns={schedulesColumns}
        data={data}
        searchKey="title"
        searchPlaceholder="タイトルで検索..."
        toolbar={
          <Button asChild>
            <Link href="/admin/schedules/new">新規作成</Link>
          </Button>
        }
        emptyState={{
          title: "スケジュールがありません",
          action: (
            <Button asChild className="mt-2">
              <Link href="/admin/schedules/new">新規作成</Link>
            </Button>
          ),
        }}
      />
    </div>
  );
}
