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

export function LegalContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>特定商取引法に基づく表記</CardTitle>
        <CardDescription>
          特定商取引法に基づく表示事項
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="space-y-4 text-sm">
            <section>
              <h2 className="font-bold text-lg mb-3">事業者情報</h2>
              <dl className="space-y-2 text-muted-foreground">
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <dt className="font-medium min-w-[200px]">販売事業者名（正式名称）</dt>
                  <dd>確認中</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <dt className="font-medium min-w-[200px]">販売事業者名（表示名）</dt>
                  <dd>IK ALUMNI CGT</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <dt className="font-medium min-w-[200px]">運営責任者</dt>
                  <dd>確認中</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <dt className="font-medium min-w-[200px]">所在地</dt>
                  <dd>確認中</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <dt className="font-medium min-w-[200px]">電話番号</dt>
                  <dd>確認中</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <dt className="font-medium min-w-[200px]">メールアドレス</dt>
                  <dd>cgt.ik.est2022@gmail.com</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <dt className="font-medium min-w-[200px]">営業時間</dt>
                  <dd>定めなし</dd>
                </div>
              </dl>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">販売価格（すべて税込）</h2>
              <div className="text-muted-foreground space-y-1 ml-4">
                <p>・個人会員：3,000円／年（入会日から1年更新）</p>
                <p>・法人会員：10,000円／年（入会日から1年更新）</p>
                <p>・プラチナ会員（法人・個人）：30,000円／年（入会日から1年更新）</p>
              </div>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">商品代金以外の必要料金</h2>
              <p className="text-muted-foreground">
                通信料等はお客様負担となります。
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">支払方法</h2>
              <p className="text-muted-foreground">
                クレジットカード決済（Stripe）
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">支払時期</h2>
              <p className="text-muted-foreground">
                申込時に決済が確定し、以後は入会日（決済日）から1年ごとに自動請求されます。
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">役務の提供時期</h2>
              <p className="text-muted-foreground">
                決済完了後、直ちに会員限定コンテンツを利用できます。
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">返品・キャンセル</h2>
              <p className="text-muted-foreground">
                デジタルコンテンツの性質上、原則として返品・キャンセルはできません。
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">中途解約・返金</h2>
              <p className="text-muted-foreground">
                原則として日割り返金等を行いません。
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">解約方法</h2>
              <p className="text-muted-foreground">
                Stripeのカスタマーポータル等、運営者が指定する方法により解約できます。
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">クーリングオフ</h2>
              <p className="text-muted-foreground">
                本サービスはクーリングオフ制度の対象外となる場合があります。
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">表現および商品に関する注意書き</h2>
              <p className="text-muted-foreground">
                閲覧環境・通信状況により表示や動作が異なる場合があります。
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
