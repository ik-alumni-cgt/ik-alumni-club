import { acceptEditorInvite } from "@/actions/members/accept-editor-invite";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// セッション参照と招待の受領を行うため動的レンダリング
export const dynamic = "force-dynamic";

/**
 * 招待リンクからの LINE ログイン後の受け口。
 * 招待を受領して編集者権限を付けたあと、執筆エリアへ送る。
 * 氏名が未入力なら /team-blog 側のガードが氏名入力画面へ誘導する。
 */
export default async function AcceptEditorInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(`/team-invite/${token}`);
  }

  const result = await acceptEditorInvite(
    token,
    session.user.id,
    session.user.email ?? null
  );

  if (!result.ok) {
    redirect(`/team-invite/${token}`);
  }

  redirect("/team-blog");
}
