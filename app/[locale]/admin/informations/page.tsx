import { Button } from "@/components/ui/button";
import { getAllInformations } from "@/data/information";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import {
  informationsColumns,
  type InformationForTable,
} from "@/components/admin/tables/columns/informations-columns";

export default async function AdminInformationsPage() {
  const informations = await getAllInformations();

  const data: InformationForTable[] = informations.map((information) => ({
    id: information.id,
    title: information.title,
    imageUrl: information.imageUrl,
    published: information.published,
    isMemberOnly: information.isMemberOnly,
    date: information.date,
  }));

  return (
    <div>
      <DataTable
        columns={informationsColumns}
        data={data}
        searchKey="title"
        searchPlaceholder="タイトルで検索..."
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
