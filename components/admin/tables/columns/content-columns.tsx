import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublishedBadgeCell } from "@/components/admin/tables/cells/published-badge-cell";
import { MemberOnlyBadgeCell } from "@/components/admin/tables/cells/member-only-badge-cell";
import { DateCell } from "@/components/admin/tables/cells/date-cell";

export type ContentForTable = {
  id: string;
  title: string;
  published: boolean;
  isMemberOnly: boolean;
  updatedAt: string;
};

export function createContentColumns(
  editBasePath: string
): ColumnDef<ContentForTable>[] {
  return [
    {
      accessorKey: "title",
      header: "タイトル",
      cell: ({ row }) => (
        <span className="font-medium line-clamp-2 max-w-[300px]">
          {row.getValue("title")}
        </span>
      ),
    },
    {
      accessorKey: "published",
      header: "公開状態",
      cell: ({ row }) => (
        <PublishedBadgeCell published={row.original.published} />
      ),
    },
    {
      accessorKey: "isMemberOnly",
      header: "限定",
      cell: ({ row }) => (
        <MemberOnlyBadgeCell isMemberOnly={row.original.isMemberOnly} />
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "更新日",
      cell: ({ row }) => <DateCell date={row.getValue("updatedAt")} />,
    },
    {
      id: "actions",
      header: () => <div className="text-right">操作</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <Button asChild variant="outline" size="sm">
            <Link href={`${editBasePath}/${row.original.id}`}>編集</Link>
          </Button>
        </div>
      ),
    },
  ];
}
