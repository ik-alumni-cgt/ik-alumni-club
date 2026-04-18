"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ImageCell } from "@/components/admin/tables/cells/image-cell";
import { PublishedBadgeCell } from "@/components/admin/tables/cells/published-badge-cell";
import { MemberOnlyBadgeCell } from "@/components/admin/tables/cells/member-only-badge-cell";
import { DateCell } from "@/components/admin/tables/cells/date-cell";
import { DeleteVideoButton } from "@/components/delete-video-button";
import { TogglePublishVideoButton } from "@/components/toggle-publish-video-button";

export type VideoForTable = {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  published: boolean;
  isMemberOnly: boolean;
  authorName: string | null;
  videoDate: string;
};

export const videosColumns: ColumnDef<VideoForTable>[] = [
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
    accessorKey: "authorName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="投稿者" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.authorName ?? "-"}
      </span>
    ),
  },
  {
    accessorKey: "videoDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="動画日付" />
    ),
    cell: ({ row }) => <DateCell date={row.getValue("videoDate")} />,
  },
  {
    id: "actions",
    header: () => <div className="text-right">操作</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2">
        <TogglePublishVideoButton
          videoId={row.original.id}
          published={row.original.published}
        />
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/videos/${row.original.id}`}>編集</Link>
        </Button>
        <DeleteVideoButton
          videoId={row.original.id}
          videoTitle={row.original.title}
        />
      </div>
    ),
  },
];
