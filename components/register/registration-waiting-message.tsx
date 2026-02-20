"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * 新規登録受付開始前の待機メッセージを表示するコンポーネント
 */
export function RegistrationWaitingMessage() {
  return (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl md:text-2xl">
            受付開始までしばらくお待ちください
          </CardTitle>
          <CardDescription className="text-center text-base">
            現在、新規会員の受付準備を進めております。
            <br />
            受付開始まで今しばらくお待ちいただけますと幸いです。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <p className="text-muted-foreground text-sm text-center">
            受付開始の際は、本サイトおよび公式SNS等でお知らせいたします。
          </p>
          <Button variant="outline" asChild className="min-h-11">
            <Link href="/supporters">サポーターズクラブのページに戻る</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
