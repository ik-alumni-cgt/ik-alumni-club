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
import { ResetPaymentButton } from "@/components/admin/reset-payment-button";

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const account = await getAccountById(id);

  if (!account) {
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
    <div className="max-w-3xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/accounts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">会員詳細</h1>
            <p className="text-muted-foreground">会員情報を確認できます</p>
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
            <CardDescription>会員の基本的な情報です</CardDescription>
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
            <CardDescription>会員の詳細な個人情報です</CardDescription>
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
            <CardTitle>会員情報</CardTitle>
            <CardDescription>会員のステータスや権限です</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                会員プラン
              </div>
              <div className="col-span-2 text-sm">
                {account.plan ? account.plan.displayName : "未設定"}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                権限
              </div>
              <div className="col-span-2">{getRoleBadge(account.role)}</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                ステータス
              </div>
              <div className="col-span-2">{getStatusBadge(account.status || "pending_profile")}</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                プロフィール完了
              </div>
              <div className="col-span-2 text-sm">
                {account.profileCompleted ? (
                  <Badge variant="default">完了</Badge>
                ) : (
                  <Badge variant="secondary">未完了</Badge>
                )}
              </div>
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

        <Card>
          <CardHeader>
            <CardTitle>支払い管理</CardTitle>
            <CardDescription>
              返金対応後に再度手続きしてもらう場合はリセットを実行してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                支払いステータス
              </div>
              <div className="col-span-2 text-sm">
                {account.paymentStatus ?? "未設定"}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                サブスクリプションID
              </div>
              <div className="col-span-2 text-sm font-mono break-all">
                {account.stripeSubscriptionId ?? "-"}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                有効期間
              </div>
              <div className="col-span-2 text-sm">
                {account.subscriptionStartDate && account.subscriptionEndDate
                  ? `${new Date(account.subscriptionStartDate).toLocaleDateString("ja-JP")} 〜 ${new Date(account.subscriptionEndDate).toLocaleDateString("ja-JP")}`
                  : "-"}
              </div>
            </div>
            <ResetPaymentButton
              accountId={account.id}
              accountName={
                account.lastName && account.firstName
                  ? `${account.lastName} ${account.firstName}`
                  : account.user.name
              }
            />
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
