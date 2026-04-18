import { Button } from "@/components/ui/button";
import { getAllInformations } from "@/data/information";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ContentDataTable } from "@/components/admin/tables/content-data-table";
import type { ContentForTable } from "@/components/admin/tables/columns/content-columns";

export default async function AdminInformationsPage() {
  const informations = await getAllInformations();

  const data: ContentForTable[] = informations.map((information) => ({
    id: information.id,
    title: information.title,
    published: information.published,
    isMemberOnly: information.isMemberOnly,
    updatedAt: information.updatedAt.toISOString(),
  }));

  return (
    <div>
      <ContentDataTable
        data={data}
        editBasePath="/admin/informations"
        toolbar={
          <Button asChild>
            <Link href="/admin/informations/new">
              <Plus className="mr-2 h-4 w-4" />
              新規作成
            </Link>
          </Button>
        }
        emptyState={{
          title: "お知らせがありません",
          description: "新しいお知らせを作成してください",
          action: (
            <Button asChild className="mt-2">
              <Link href="/admin/informations/new">
                <Plus className="mr-2 h-4 w-4" />
                新規作成
              </Link>
            </Button>
          ),
        }}
      />
    </div>
  );
}
