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
        <div className="py-1">
          <span className="block font-medium line-clamp-2">
            {row.getValue("title")}
          </span>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 md:hidden">
            <PublishedBadgeCell published={row.original.published} />
            <MemberOnlyBadgeCell isMemberOnly={row.original.isMemberOnly} />
          </div>
          <div className="mt-1 md:hidden">
            <DateCell date={row.original.updatedAt} />
          </div>
        </div>
      ),
    },
    {
      id: "status",
      header: "ステータス",
      meta: { widthPercent: 25, hideOnMobile: true },
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
      meta: { widthPercent: 20, hideOnMobile: true },
      cell: ({ row }) => <DateCell date={row.getValue("updatedAt")} />,
    },
  ];
}
