"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ImageCell } from "@/components/admin/tables/cells/image-cell";
import { PublishedBadgeCell } from "@/components/admin/tables/cells/published-badge-cell";
import { MemberOnlyBadgeCell } from "@/components/admin/tables/cells/member-only-badge-cell";
import { DateCell } from "@/components/admin/tables/cells/date-cell";

export type PhotoLibraryForTable = {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  imageCount: number;
  published: boolean;
  isMemberOnly: boolean;
  createdAt: string;
};

export const photoLibraryColumns: ColumnDef<PhotoLibraryForTable>[] = [
  {
    accessorKey: "thumbnailUrl",
    header: "",
    cell: ({ row }) => (
      <ImageCell src={row.original.thumbnailUrl} alt={row.original.title} />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="タイトル" />
    ),
    cell: ({ row }) => (
      <span className="font-medium line-clamp-2 max-w-[300px]">
        {row.getValue("title")}
      </span>
    ),
  },
  {
    accessorKey: "imageCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="画像数" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.original.imageCount}枚
      </Badge>
    ),
  },
  {
    accessorKey: "published",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="公開" />
    ),
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
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="作成日" />
    ),
    cell: ({ row }) => <DateCell date={row.getValue("createdAt")} />,
  },
  {
    id: "actions",
    header: () => <div className="text-right">操作</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/photo-library/${row.original.id}`}>編集</Link>
        </Button>
      </div>
    ),
  },
];
