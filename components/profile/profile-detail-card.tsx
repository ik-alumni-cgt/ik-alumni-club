import Link from "next/link";
import { Member } from "@/types/member";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ProfileDetailCardProps = {
  member: Member;
};

export function ProfileDetailCard({ member }: ProfileDetailCardProps) {
  // フルネーム
  const fullName = member.lastName && member.firstName
    ? `${member.lastName} ${member.firstName}`
    : "-";

  // フルネーム（カナ）
  const fullNameKana = member.lastNameKana && member.firstNameKana
    ? `${member.lastNameKana} ${member.firstNameKana}`
    : "-";

  // 住所
  const fullAddress = member.prefecture
    ? `${member.postalCode ? `〒${member.postalCode.slice(0, 3)}-${member.postalCode.slice(3)} ` : ""}${member.prefecture}${member.city || ""}${member.address || ""}${member.building ? ` ${member.building}` : ""}`
    : "-";

  return (
    <Card>
      <CardHeader>
        <CardTitle>会員情報</CardTitle>
        <CardDescription>登録されている会員情報</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 氏名セクション */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground">氏名</h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">氏名</dt>
              <dd className="text-sm font-medium">{fullName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">フリガナ</dt>
              <dd className="text-sm font-medium">{fullNameKana}</dd>
            </div>
          </dl>
        </div>

        {/* 住所セクション */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground">住所</h3>
          <dl>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">住所</dt>
              <dd className="text-sm font-medium text-right max-w-[60%]">{fullAddress}</dd>
            </div>
          </dl>
        </div>

        {/* 連絡先セクション */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground">連絡先</h3>
          <dl>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">電話番号</dt>
              <dd className="text-sm font-medium">{member.phoneNumber || "-"}</dd>
            </div>
          </dl>
        </div>

        {/* ボタン */}
        <div className="flex flex-col gap-4 pt-4">
          <Button asChild className="w-full min-h-11">
            <Link href="/profile/edit">編集する</Link>
          </Button>
          <Button asChild variant="outline" className="w-full min-h-11">
            <Link href="/mypage">戻る</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
