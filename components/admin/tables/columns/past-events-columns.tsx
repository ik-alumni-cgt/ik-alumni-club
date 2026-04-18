"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublishedBadgeCell } from "@/components/admin/tables/cells/published-badge-cell";
import { MemberOnlyBadgeCell } from "@/components/admin/tables/cells/member-only-badge-cell";
import { DateCell } from "@/components/admin/tables/cells/date-cell";

export type PastEventForTable = {
  id: string;
  title: string;
  eventDate: string;
  imageUrl: string | null;
  published: boolean;
  isMemberOnly: boolean;
};

export const pastEventsColumns: ColumnDef<PastEventForTable>[] = [
{
    accessorKey: "title",
    header: "タイトル",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("title")}</span>
    ),
  },
  {
    accessorKey: "eventDate",
    header: "イベント日時",
    cell: ({ row }) => (
      <DateCell date={row.getValue("eventDate")} showTime />
    ),
  },
  {
    accessorKey: "published",
    header: "公開",
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
      <div className="text-right">
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/past-events/${row.original.id}`}>編集</Link>
        </Button>
      </div>
    ),
  },
];
