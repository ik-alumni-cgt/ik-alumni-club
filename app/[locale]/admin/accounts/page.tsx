import { Button } from "@/components/ui/button";
import { getAllAccounts } from "@/data/account";
import { SendTestEmailButton } from "@/components/admin/send-test-email-button";
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

export default async function AdminAccountsPage() {
  const accounts = await getAllAccounts();

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

      {accounts.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">会員がいません</h3>
            <p className="text-sm text-muted-foreground">
              会員が登録されていません
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
                  <TableCell>{getStatusBadge(account.status || "pending_profile")}</TableCell>
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
