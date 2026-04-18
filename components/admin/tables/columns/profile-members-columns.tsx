"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type ProfileMemberForTable = {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  sortOrder: number;
  isVisible: boolean;
};

export const profileMembersColumns: ColumnDef<ProfileMemberForTable>[] = [
{
    accessorKey: "name",
    header: "名前",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "sortOrder",
    header: "表示順",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.getValue("sortOrder")}
      </Badge>
    ),
  },
  {
    accessorKey: "isVisible",
    header: "状態",
    cell: ({ row }) =>
      row.original.isVisible ? (
        <Badge variant="default">公開</Badge>
      ) : (
        <Badge variant="secondary">非公開</Badge>
      ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">操作</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/profile-members/${row.original.id}`}>編集</Link>
        </Button>
      </div>
    ),
  },
];
