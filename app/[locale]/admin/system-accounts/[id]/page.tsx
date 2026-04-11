import { Button } from "@/components/ui/button";
import { getAccountById } from "@/data/account";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteAccountButton } from "@/components/delete-account-button";

export default async function SystemAccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const account = await getAccountById(id);

  if (!account || account.role !== "admin") {
    notFound();
  }

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

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/system-accounts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">システムアカウント詳細</h1>
            <p className="text-muted-foreground">管理者アカウントの情報を確認できます</p>
          </div>
          <Button asChild>
            <Link href={`/admin/accounts/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              編集
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
            <CardDescription>アカウントの基本的な情報です</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                会員ID
              </div>
              <div className="col-span-2 text-sm">{account.id}</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                ユーザーID
              </div>
              <div className="col-span-2 text-sm">{account.userId}</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                登録日時
              </div>
              <div className="col-span-2 text-sm">
                {new Date(account.createdAt).toLocaleString("ja-JP")}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                最終更新日時
              </div>
              <div className="col-span-2 text-sm">
                {new Date(account.updatedAt).toLocaleString("ja-JP")}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>認証情報</CardTitle>
            <CardDescription>認証に関する情報です</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                メールアドレス
              </div>
              <div className="col-span-2 text-sm">
                {account.email || account.user.email}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                メール認証
              </div>
              <div className="col-span-2 text-sm">
                {account.user.emailVerified ? (
                  <Badge variant="default">認証済み</Badge>
                ) : (
                  <Badge variant="secondary">未認証</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>個人情報</CardTitle>
            <CardDescription>アカウントの詳細な個人情報です</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                氏名
              </div>
              <div className="col-span-2 text-sm">
                {account.lastName && account.firstName
                  ? `${account.lastName} ${account.firstName}`
                  : "未設定"}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                フリガナ
              </div>
              <div className="col-span-2 text-sm">
                {account.lastNameKana && account.firstNameKana
                  ? `${account.lastNameKana} ${account.firstNameKana}`
                  : "未設定"}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                郵便番号
              </div>
              <div className="col-span-2 text-sm">
                {account.postalCode || "未設定"}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                住所
              </div>
              <div className="col-span-2 text-sm">
                {account.prefecture || account.city || account.address
                  ? `${account.prefecture || ""} ${account.city || ""} ${account.address || ""} ${account.building || ""}`
                  : "未設定"}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                電話番号
              </div>
              <div className="col-span-2 text-sm">
                {account.phoneNumber || "未設定"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>アカウント情報</CardTitle>
            <CardDescription>アカウントのステータスです</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                権限
              </div>
              <div className="col-span-2">
                <Badge variant="default">管理者</Badge>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                ステータス
              </div>
              <div className="col-span-2">{getStatusBadge(account.status || "pending_profile")}</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                アクティブ
              </div>
              <div className="col-span-2 text-sm">
                {account.isActive ? (
                  <Badge variant="default">有効</Badge>
                ) : (
                  <Badge variant="destructive">無効</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">危険な操作</CardTitle>
            <CardDescription>
              この操作は取り消すことができません
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeleteAccountButton
              accountId={account.id}
              accountName={
                account.lastName && account.firstName
                  ? `${account.lastName} ${account.firstName}`
                  : account.user.name
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
