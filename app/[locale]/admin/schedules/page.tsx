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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">スケジュール管理</h1>
          <p className="text-muted-foreground">
            スケジュールの作成・編集ができます
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/schedules/new">新規作成</Link>
        </Button>
      </div>

      <DataTable
        columns={schedulesColumns}
        data={data}
        searchKey="title"
        searchPlaceholder="タイトルで検索..."
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
