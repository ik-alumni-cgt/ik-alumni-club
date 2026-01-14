import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { setLocale } from "@/app/web/i18n/set-locale";

export default async function PaymentSuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  return (
    <div className="w-full max-w-4xl">
      <Card>
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">お支払いが完了しました！</CardTitle>
            <CardDescription>
              IK ALUMNI CLUBへようこそ
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                ご登録ありがとうございます。
                <br />
                全ての機能をご利用いただけます。
              </p>
            </div>

            <div className="border-t pt-6 space-y-3">
              <Button asChild size="lg" className="w-full">
                <Link href="/mypage">マイページへ</Link>
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                領収書はご登録のメールアドレスに送信されます
              </p>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
