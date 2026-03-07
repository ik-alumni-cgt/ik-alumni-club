import Link from "next/link";
import { Lock, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MemberOnlyContentProps {
  contentType: string;
}

export function MemberOnlyContent({ contentType }: MemberOnlyContentProps) {
  return (
    <div className="container max-w-2xl mx-auto pt-20 pb-32">
      <Card className="border-2 border-amber-500/20">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
            <Lock className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl">会員限定コンテンツ</CardTitle>
          <CardDescription className="text-base">
            この{contentType}は会員限定コンテンツです
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            このコンテンツを閲覧するには、会員登録が必要です。
            <br />
            会員になると、限定コンテンツへのアクセスをはじめ、
            <br />
            さまざまな特典をご利用いただけます。
          </p>
          <div className="rounded-lg bg-muted p-4">
            <h3 className="font-semibold mb-2">会員特典</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 会員限定コンテンツへのフルアクセス</li>
              <li>• 最新情報やDigital Magazineの配信</li>
              <li>• 会員限定イベントへの参加</li>
              <li>• その他の特別な特典</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/signup">
              <UserPlus className="mr-2 h-5 w-5" />
              会員登録する
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/login">
              ログイン
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
