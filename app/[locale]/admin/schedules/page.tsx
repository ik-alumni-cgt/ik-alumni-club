import { getAllSchedules } from "@/data/schedule";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ContentDataTable } from "@/components/admin/tables/content-data-table";
import type { ContentForTable } from "@/components/admin/tables/columns/content-columns";

export default async function AdminSchedulesPage() {
  const schedules = await getAllSchedules();

  const data: ContentForTable[] = schedules.map((schedule) => ({
    id: schedule.id,
    title: schedule.title,
    published: schedule.published,
    isMemberOnly: schedule.isMemberOnly,
    updatedAt: schedule.updatedAt.toISOString(),
  }));

  return (
    <div>
      <ContentDataTable
        data={data}
        editBasePath="/admin/schedules"
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
