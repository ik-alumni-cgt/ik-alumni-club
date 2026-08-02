import { setLocale } from "@/app/web/i18n/set-locale";
import { InviteLoginForm } from "@/components/team-login-form/invite-login-form";
import { Card, CardContent } from "@/components/ui/card";
import { getEditorInviteByToken, getInviteState } from "@/data/editor-invite";

// 招待の状態を毎回確認するため動的レンダリング
export const dynamic = "force-dynamic";

const INVALID_MESSAGES = {
  not_found: {
    title: "招待が見つかりません",
    body: "リンクが正しいかご確認ください。分からない場合は運営までお問い合わせください。",
  },
  full: {
    title: "この招待は上限に達しました",
    body: "運営に新しい招待リンクの発行を依頼してください。",
  },
  expired: {
    title: "招待の有効期限が切れています",
    body: "運営に新しい招待リンクの発行を依頼してください。",
  },
} as const;

export default async function TeamInvitePage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { token } = await params;
  await setLocale(params);

  const invite = await getEditorInviteByToken(token);
  const state = getInviteState(invite);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        {state === "valid" ? (
          <InviteLoginForm token={token} />
        ) : (
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col items-center gap-3 text-center">
                <h1 className="text-xl font-bold">
                  {INVALID_MESSAGES[state].title}
                </h1>
                <p className="text-muted-foreground text-balance">
                  {INVALID_MESSAGES[state].body}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
