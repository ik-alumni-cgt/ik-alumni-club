import type { ColumnDef } from "@tanstack/react-table";
import { PublishedBadgeCell } from "@/components/admin/tables/cells/published-badge-cell";
import { MemberOnlyBadgeCell } from "@/components/admin/tables/cells/member-only-badge-cell";
import { DateCell } from "@/components/admin/tables/cells/date-cell";

export type ContentForTable = {
  id: string;
  title: string;
  published: boolean;
  isMemberOnly: boolean;
  updatedAt: string;
  imageUrl?: string | null;
};

export function createContentColumns(): ColumnDef<ContentForTable>[] {
  return [
    {
      accessorKey: "title",
      header: "タイトル",
      meta: { widthPercent: 55 },
      cell: ({ row }) => (
        <span className="block py-1 font-medium line-clamp-2">
          {row.getValue("title")}
        </span>
      ),
    },
    {
      id: "status",
      header: "ステータス",
      meta: { widthPercent: 25 },
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <PublishedBadgeCell published={row.original.published} />
          <MemberOnlyBadgeCell isMemberOnly={row.original.isMemberOnly} />
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "更新日",
      meta: { widthPercent: 20 },
      cell: ({ row }) => <DateCell date={row.getValue("updatedAt")} />,
    },
  ];
}
