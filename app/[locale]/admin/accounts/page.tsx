import { Button } from "@/components/ui/button";
import { getAllAccounts } from "@/data/account";
import { SendTestEmailButton } from "@/components/admin/send-test-email-button";
import { AccountFilters } from "@/components/admin/account-filters";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { MemberStatus } from "@/types/member";
import { Suspense } from "react";

type PaymentStatus = "pending" | "completed" | "failed" | "canceled";

type SearchParams = {
  status?: string;
  paymentStatus?: string;
  isMigrated?: string;
};

const getStatusBadge = (status: string) => {
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
};

const getRoleBadge = (role: string) => {
  switch (role) {
    case "admin":
      return <Badge variant="default">管理者</Badge>;
    case "member":
      return <Badge variant="outline">会員</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

const getPaymentStatusBadge = (status: string | null) => {
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
};

const VALID_STATUSES: MemberStatus[] = ["pending_profile", "active", "inactive"];
const VALID_PAYMENT_STATUSES: PaymentStatus[] = ["pending", "completed", "failed", "canceled"];

export default async function AdminAccountsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const status = VALID_STATUSES.includes(params.status as MemberStatus)
    ? (params.status as MemberStatus)
    : undefined;

  const paymentStatus = VALID_PAYMENT_STATUSES.includes(params.paymentStatus as PaymentStatus)
    ? (params.paymentStatus as PaymentStatus)
    : undefined;

  const isMigrated =
    params.isMigrated === "migrated"
      ? true
      : params.isMigrated === "existing"
        ? false
        : undefined;

  const accounts = await getAllAccounts({ status, paymentStatus, isMigrated });

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">会員管理</h1>
          <p className="text-muted-foreground">
            会員の一覧・詳細・編集・削除ができます
          </p>
        </div>
        <SendTestEmailButton />
      </div>

      <div className="mb-4">
        <Suspense>
          <AccountFilters />
        </Suspense>
      </div>

      {accounts.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">該当する会員がいません</h3>
            <p className="text-sm text-muted-foreground">
              フィルター条件に合う会員が見つかりませんでした
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
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
                  <TableCell className="font-medium">
                    {account.lastName && account.firstName
                      ? `${account.lastName} ${account.firstName}`
                      : account.user.name}
                  </TableCell>
                  <TableCell>{account.email || account.user.email}</TableCell>
                  <TableCell>
                    {account.plan ? account.plan.displayName : "未設定"}
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
      )}
    </div>
  );
}
