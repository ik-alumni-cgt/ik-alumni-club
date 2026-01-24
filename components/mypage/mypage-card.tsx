import Link from "next/link";
import { User } from "@/types/user";
import { Member } from "@/types/member";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

type MypageCardProps = {
  user: User;
  member: Member | null;
};

export function MypageCard({ user, member }: MypageCardProps) {
  // 名前を取得（member情報があればそちらを優先）
  const displayName = member?.lastName && member?.firstName
    ? `${member.lastName} ${member.firstName}`
    : user.name;

  // 会員IDを取得
  const memberId = member?.id ?? "-";

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>マイページ</CardTitle>
          <CardDescription>アカウント情報</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            <li className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-muted-foreground">名前</span>
              <span className="font-medium">{displayName}</span>
            </li>
            <li className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-muted-foreground">会員ID</span>
              <span className="font-medium">{memberId}</span>
            </li>
            <li>
              <Link
                href="/profile"
                className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm">会員情報の確認・変更</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm">プライバシーポリシー</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </li>
            <li>
              <Link
                href="/legal"
                className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm">特定商取引法に基づく表記</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </li>
            <li>
              <Link
                href="/refund"
                className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm">返金・解約ポリシー</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Button asChild variant="outline" className="w-full min-h-11">
        <Link href="/">ホームに戻る</Link>
      </Button>
    </div>
  );
}
