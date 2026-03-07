"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mail } from "lucide-react";
import { BulkEmailDialog } from "./bulk-email-dialog";

type AccountForTable = {
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

type Props = {
  accounts: AccountForTable[];
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

function getRoleBadge(role: string) {
  switch (role) {
    case "admin":
      return <Badge variant="default">管理者</Badge>;
    case "member":
      return <Badge variant="outline">会員</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
}

function getPaymentStatusBadge(status: string | null) {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">支払済</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">未払い</Badge>;
    case "failed":
      return <Badge variant="destructive">失敗</Badge>;
    case "canceled":
      return <Badge variant="outline" className="text-muted-foreground">キャンセル</Badge>;
    default:
      return <Badge variant="outline" className="text-muted-foreground">-</Badge>;
  }
}

function getDisplayName(account: AccountForTable) {
  if (account.lastName && account.firstName) {
    return `${account.lastName} ${account.firstName}`;
  }
  return account.userName;
}

export function AccountsTable({ accounts }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const allSelected = accounts.length > 0 && selectedIds.size === accounts.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < accounts.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(accounts.map((a) => a.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelectedIds(next);
  };

  const selectedMembers = accounts
    .filter((a) => selectedIds.has(a.id))
    .map((a) => ({
      id: a.id,
      email: a.email || a.userEmail,
      name: getDisplayName(a),
    }));

  return (
    <>
      {selectedIds.size > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-md border bg-muted/50 px-4 py-2">
          <span className="text-sm font-medium">
            {selectedIds.size}件選択中（全{accounts.length}件中）
          </span>
          <Button
            size="sm"
            onClick={() => setEmailDialogOpen(true)}
          >
            <Mail className="mr-1.5 h-4 w-4" />
            メール送信
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected ? true : someSelected ? "indeterminate" : false}
                  onCheckedChange={(checked) => handleSelectAll(checked === true)}
                  aria-label="全選択"
                />
              </TableHead>
              <TableHead>氏名</TableHead>
              <TableHead>メールアドレス</TableHead>
              <TableHead>プラン</TableHead>
              <TableHead>権限</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>支払い</TableHead>
              <TableHead>移行</TableHead>
              <TableHead>ログイン</TableHead>
              <TableHead>登録日</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(account.id)}
                    onCheckedChange={(checked) =>
                      handleSelectOne(account.id, checked === true)
                    }
                    aria-label={`${getDisplayName(account)}を選択`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {getDisplayName(account)}
                </TableCell>
                <TableCell>{account.email || account.userEmail}</TableCell>
                <TableCell>
                  {account.planDisplayName ?? "未設定"}
                </TableCell>
                <TableCell>{getRoleBadge(account.role)}</TableCell>
                <TableCell>{getStatusBadge(account.status ?? "pending_profile")}</TableCell>
                <TableCell>{getPaymentStatusBadge(account.paymentStatus)}</TableCell>
                <TableCell>
                  {account.isMigrated ? (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">移行</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
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
                    <Link href={`/admin/accounts/${account.id}`}>詳細</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <BulkEmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        selectedMembers={selectedMembers}
        onSendComplete={() => setSelectedIds(new Set())}
      />
    </>
  );
}
