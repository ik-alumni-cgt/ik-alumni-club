"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function RefundContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>返金・解約ポリシー</CardTitle>
        <CardDescription>
          解約手続きと返金に関するポリシー
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="space-y-4 text-sm">
            <section>
              <h2 className="font-bold text-lg mb-3">1. 解約方法</h2>
              <p className="text-muted-foreground">
                会員は、運営者が指定する方法（Stripeのカスタマーポータル等を含みます）により解約できます。
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">2. 解約の適用タイミング</h2>
              <p className="text-muted-foreground">
                解約が完了した場合、次回更新日以降は請求が発生しません。
                解約手続き後も、当該請求期間の終了までは会員限定コンテンツを利用できる場合があります。
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">3. 返金</h2>
              <div className="text-muted-foreground space-y-2">
                <p>会費の性質上、原則として支払済み会費は返金しません。</p>
                <p>中途解約時の日割り返金は行いません。</p>
                <p>ただし、法令上返金が必要な場合はこの限りではありません。</p>
              </div>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">4. 決済失敗時の対応</h2>
              <div className="text-muted-foreground space-y-2">
                <p>会費の決済が失敗した場合、会員限定コンテンツの利用を制限する場合があります。</p>
                <p>会員はStripe上で支払情報を更新するものとします。</p>
              </div>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">5. 退会後のデータ</h2>
              <p className="text-muted-foreground">
                退会後の登録情報は、法令対応および不正防止等のため一定期間保管した後、適切に削除します。
              </p>
            </section>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild className="min-h-11">
          <Link href="/">Homeに戻る</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
