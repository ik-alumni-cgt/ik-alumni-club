"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DateCell } from "@/components/admin/tables/cells/date-cell";

export type AccountForTable = {
  id: string;
  lastName: string | null;
  firstName: string | null;
  email: string | null;
  userName: string;
  userEmail: string;
  planDisplayName: string | null;
  role: string;
  status: string | null;
  paymentStatus: string | null;
  isMigrated: boolean;
  hasLoginSetup: boolean;
  createdAt: string;
};

function getDisplayName(account: AccountForTable) {
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
    case "pending_approval":
      return <Badge variant="secondary" className="bg-amber-100 text-amber-800">承認待ち</Badge>;
    case "inactive":
      return <Badge variant="destructive">非アクティブ</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getRoleBadge(role: string) {
  switch (role) {
    case "admin":
      return <Badge variant="default">管理者</Badge>;
    case "officer":
      return <Badge variant="outline">役員</Badge>;
    case "team_member":
      return <Badge variant="outline">チームメンバー</Badge>;
    case "member":
      return <Badge variant="outline">会員</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
}

function getPaymentStatusBadge(status: string | null) {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          支払済
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          未払い
        </Badge>
      );
    case "failed":
      return <Badge variant="destructive">失敗</Badge>;
    case "canceled":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          キャンセル
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-muted-foreground">
          -
        </Badge>
      );
  }
}

export const accountsColumns: ColumnDef<AccountForTable>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="全選択"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`${getDisplayName(row.original)}を選択`}
      />
    ),
    enableSorting: false,
  },
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
    accessorKey: "planDisplayName",
    header: "プラン",
    cell: ({ row }) => row.original.planDisplayName ?? "未設定",
  },
  {
    accessorKey: "role",
    header: "権限",
    cell: ({ row }) => getRoleBadge(row.original.role),
  },
  {
    accessorKey: "status",
    header: "ステータス",
    cell: ({ row }) =>
      getStatusBadge(row.original.status ?? "pending_profile"),
  },
  {
    accessorKey: "paymentStatus",
    header: "支払い",
    cell: ({ row }) => getPaymentStatusBadge(row.original.paymentStatus),
  },
  {
    accessorKey: "isMigrated",
    header: "移行",
    cell: ({ row }) =>
      row.original.isMigrated ? (
        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
          移行
        </Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      ),
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
          <Link href={`/admin/accounts/${row.original.id}`}>詳細</Link>
        </Button>
      </div>
    ),
  },
];
