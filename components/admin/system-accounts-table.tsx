"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SystemAccountForTable = {
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

type Props = {
  accounts: SystemAccountForTable[];
};

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

function getDisplayName(account: SystemAccountForTable) {
  if (account.lastName && account.firstName) {
    return `${account.lastName} ${account.firstName}`;
  }
  return account.userName;
}

export function SystemAccountsTable({ accounts }: Props) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>氏名</TableHead>
            <TableHead>メールアドレス</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead>ログイン</TableHead>
            <TableHead>登録日</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell className="font-medium">
                {getDisplayName(account)}
              </TableCell>
              <TableCell>{account.email || account.userEmail}</TableCell>
              <TableCell>{getStatusBadge(account.status ?? "pending_profile")}</TableCell>
              <TableCell>
                {account.hasLoginSetup ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">設定済</Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">未設定</Badge>
                )}
              </TableCell>
              <TableCell>
                {new Date(account.createdAt).toLocaleDateString("ja-JP")}
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/system-accounts/${account.id}`}>詳細</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
