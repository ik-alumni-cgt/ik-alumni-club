"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublishedBadgeCell } from "@/components/admin/tables/cells/published-badge-cell";
import { MemberOnlyBadgeCell } from "@/components/admin/tables/cells/member-only-badge-cell";
import { DateCell } from "@/components/admin/tables/cells/date-cell";

export type BlogForTable = {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  published: boolean;
  isMemberOnly: boolean;
  authorName: string | null;
  createdAt: string;
};

export const blogsColumns: ColumnDef<BlogForTable>[] = [
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
    accessorKey: "authorName",
    header: "投稿者",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.authorName ?? "-"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "作成日",
    cell: ({ row }) => <DateCell date={row.getValue("createdAt")} />,
  },
  {
    id: "actions",
    header: () => <div className="text-right">操作</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/blogs/${row.original.id}`}>編集</Link>
        </Button>
      </div>
    ),
  },
];
