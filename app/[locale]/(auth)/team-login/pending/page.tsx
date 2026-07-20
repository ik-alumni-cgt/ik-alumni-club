import { setLocale } from "@/app/web/i18n/set-locale";
import { Card, CardContent } from "@/components/ui/card";

export default async function TeamLoginPendingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col items-center text-center gap-3">
              <h1 className="text-xl font-bold">承認待ちです</h1>
              <p className="text-muted-foreground text-balance">
                ログインを受け付けました。管理者の承認が完了すると、メンバー機能をご利用いただけます。
              </p>
              <p className="text-sm text-muted-foreground">
                承認までしばらくお待ちください。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
