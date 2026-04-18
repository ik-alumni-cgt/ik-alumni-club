"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ImageCell } from "@/components/admin/tables/cells/image-cell";
import { PublishedBadgeCell } from "@/components/admin/tables/cells/published-badge-cell";
import { MemberOnlyBadgeCell } from "@/components/admin/tables/cells/member-only-badge-cell";
import { DateCell } from "@/components/admin/tables/cells/date-cell";

export type ScheduleForTable = {
  id: string;
  title: string;
  eventDate: string;
  imageUrl: string | null;
  linkUrl: string | null;
  sortOrder: number;
  published: boolean;
  isMemberOnly: boolean;
};

export const schedulesColumns: ColumnDef<ScheduleForTable>[] = [
  {
    accessorKey: "imageUrl",
    header: "",
    cell: ({ row }) => (
      <ImageCell src={row.original.imageUrl} alt={row.original.title} />
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
    accessorKey: "eventDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="イベント日時" />
    ),
    cell: ({ row }) => (
      <DateCell date={row.getValue("eventDate")} showTime />
    ),
  },
  {
    accessorKey: "sortOrder",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="表示順" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.getValue("sortOrder")}
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
    id: "actions",
    header: () => <div className="text-right">操作</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2">
        {row.original.linkUrl && (
          <Button asChild variant="ghost" size="sm">
            <a
              href={row.original.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/schedules/${row.original.id}`}>編集</Link>
        </Button>
      </div>
    ),
  },
];
