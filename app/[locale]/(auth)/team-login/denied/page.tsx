import { setLocale } from "@/app/web/i18n/set-locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EDITOR_LOGIN_PATH, type EditorDeniedReason } from "@/lib/session";
import Link from "next/link";

const MESSAGES: Record<EditorDeniedReason, { title: string; body: string }> = {
  no_session: {
    title: "ログインが必要です",
    body: "メンバーブログを利用するには、LINE でログインしてください。",
  },
  line_required: {
    title: "LINE でのログインが必要です",
    body: "メンバーブログは LINE ログイン専用です。LINE でログインし直してください。",
  },
  not_editor: {
    title: "執筆権限がありません",
    body: "メンバーブログの執筆には招待が必要です。運営までお問い合わせください。",
  },
  name_required: {
    title: "氏名の入力が必要です",
    body: "メンバーブログを利用する前に氏名をご入力ください。",
  },
};

export default async function TeamLoginDeniedPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ reason?: string }>;
}) {
  await setLocale(params);
  const { reason } = await searchParams;

  const message =
    reason && reason in MESSAGES
      ? MESSAGES[reason as EditorDeniedReason]
      : MESSAGES.not_editor;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <h1 className="text-xl font-bold">{message.title}</h1>
              <p className="text-muted-foreground text-balance">
                {message.body}
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href={EDITOR_LOGIN_PATH}>ログイン画面に戻る</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
