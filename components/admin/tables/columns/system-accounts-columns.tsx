"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DateCell } from "@/components/admin/tables/cells/date-cell";

export type SystemAccountForTable = {
  id: string;
  lastName: string | null;
  firstName: string | null;
  email: string | null;
  userName: string;
  userEmail: string;
  status: string | null;
  hasLoginSetup: boolean;
  createdAt: string;
};

function getDisplayName(account: SystemAccountForTable) {
  if (account.lastName && account.firstName) {
    return `${account.lastName} ${account.firstName}`;
  }
  return account.userName;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge variant="default">アクティブ</Badge>;
    case "pending_profile":
      return <Badge variant="secondary">プロフィール入力待ち</Badge>;
    case "inactive":
      return <Badge variant="destructive">非アクティブ</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export const systemAccountsColumns: ColumnDef<SystemAccountForTable>[] = [
  {
    accessorKey: "name",
    header: "氏名",
    accessorFn: (row) => getDisplayName(row),
    cell: ({ row }) => (
      <span className="font-medium">{getDisplayName(row.original)}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "メールアドレス",
    accessorFn: (row) => row.email || row.userEmail,
    cell: ({ row }) => row.original.email || row.original.userEmail,
  },
  {
    accessorKey: "status",
    header: "ステータス",
    cell: ({ row }) =>
      getStatusBadge(row.original.status ?? "pending_profile"),
  },
  {
    accessorKey: "hasLoginSetup",
    header: "ログイン",
    cell: ({ row }) =>
      row.original.hasLoginSetup ? (
        <Badge variant="default" className="bg-green-100 text-green-800">
          設定済
        </Badge>
      ) : (
        <Badge variant="outline" className="text-muted-foreground">
          未設定
        </Badge>
      ),
  },
  {
    accessorKey: "createdAt",
    header: "登録日",
    cell: ({ row }) => <DateCell date={row.getValue("createdAt")} />,
  },
  {
    id: "actions",
    header: () => <div className="text-right">操作</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/system-accounts/${row.original.id}`}>詳細</Link>
        </Button>
      </div>
    ),
  },
];
