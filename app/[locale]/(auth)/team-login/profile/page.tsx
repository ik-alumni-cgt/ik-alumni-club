import { setLocale } from "@/app/web/i18n/set-locale";
import { EditorNameForm } from "@/components/team-login-form/editor-name-form";
import { Card, CardContent } from "@/components/ui/card";
import { verifyEditorForProfile } from "@/lib/session";

// セッションと会員情報を参照するため動的レンダリング
export const dynamic = "force-dynamic";

export default async function EditorProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const { member } = await verifyEditorForProfile();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-xl font-bold">氏名のご登録</h1>
                <p className="text-muted-foreground text-balance mt-2">
                  メンバーブログのご利用には氏名の登録が必要です。
                </p>
              </div>
              <EditorNameForm
                defaultValues={{
                  lastName: member.lastName ?? "",
                  firstName: member.firstName ?? "",
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
