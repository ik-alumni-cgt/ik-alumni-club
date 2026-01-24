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

export function PrivacyContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>プライバシーポリシー</CardTitle>
        <CardDescription>
          個人情報の取り扱いについて
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="space-y-4 text-sm">
            <section>
              <h2 className="font-bold text-lg mb-3">1. 基本方針</h2>
              <p className="text-muted-foreground">
                IK ALUMNI CGT（以下「運営者」といいます）は、本サービスにおける個人情報を適切に取り扱います。
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">2. 取得する情報</h2>
              <p className="text-muted-foreground mb-2">
                運営者は、以下の情報を取得します。
              </p>
              <div className="text-muted-foreground space-y-2 ml-4">
                <p><strong>登録情報：</strong>メールアドレス、氏名、パスワード（ハッシュ化した情報）</p>
                <p><strong>プロフィール情報：</strong>氏名（漢字・カナ）、郵便番号、住所、電話番号</p>
                <p><strong>決済関連：</strong>Stripe Customer ID、Stripe Subscription ID（カード情報は保有しません）</p>
                <p><strong>自動収集情報：</strong>IPアドレス、User Agent、セッション情報、アクセス日時 等</p>
              </div>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">3. 利用目的</h2>
              <p className="text-muted-foreground mb-2">
                運営者は、取得した情報を以下の目的で利用します。
              </p>
              <div className="text-muted-foreground space-y-1 ml-4">
                <p>・会員登録、本人確認、アカウント管理</p>
                <p>・会費決済、請求、決済状況の確認</p>
                <p>・会員限定コンテンツの提供および利用可否判定</p>
                <p>・お問い合わせ対応、重要なお知らせ連絡</p>
                <p>・不正利用防止、セキュリティ対策、規約違反対応</p>
                <p>・アクセス解析、品質・機能改善</p>
              </div>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">4. 第三者提供・外部サービス連携</h2>
              <p className="text-muted-foreground mb-2">
                運営者は、法令に基づく場合を除き、本人同意なく個人情報を第三者に提供しません。
                ただし、本サービス提供のため以下の外部サービスを利用し、必要な範囲で情報が送信される場合があります。
              </p>
              <div className="text-muted-foreground space-y-1 ml-4">
                <p><strong>Stripe：</strong>決済処理（顧客ID、サブスクリプション情報等）</p>
                <p><strong>Supabase：</strong>データベース（会員情報等）</p>
                <p><strong>Cloudflare R2：</strong>ファイル保管（画像、PDF等）</p>
                <p><strong>Vercel：</strong>ホスティング（アプリ提供に必要な通信データ等）</p>
              </div>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">5. Cookie等の利用</h2>
              <p className="text-muted-foreground">
                運営者は、利便性向上およびアクセス解析のためCookie等を利用する場合があります。
                Cookieを無効化した場合、一部機能が利用できない場合があります。
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">6. 安全管理措置</h2>
              <p className="text-muted-foreground">
                運営者は、不正アクセス・漏えい等を防止するため合理的な安全管理措置を講じます。
                パスワードはハッシュ化して保存し、平文では保存しません。
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">7. 保有期間</h2>
              <p className="text-muted-foreground">
                運営者は、利用目的の達成に必要な期間、個人情報を保管します。
                退会後の情報は、法令対応および不正防止等のため一定期間保管した後、適切に削除します。
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">8. 開示・訂正・削除等</h2>
              <p className="text-muted-foreground mb-2">
                会員は、自己の個人情報について開示、訂正、削除、利用停止等を求めることができます。
                請求は以下の窓口で受け付けます。
              </p>
              <p className="text-muted-foreground ml-4">
                <strong>窓口：</strong>cgt.ik.est2022@gmail.com
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">9. 未成年の利用</h2>
              <p className="text-muted-foreground">
                18歳未満の方が利用する場合、保護者の同意を得たうえで利用するものとします。
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">10. 改定</h2>
              <p className="text-muted-foreground">
                運営者は、必要に応じて本ポリシーを改定します。
                改定後の内容は、本サービス上で公表した時点から適用されます。
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
