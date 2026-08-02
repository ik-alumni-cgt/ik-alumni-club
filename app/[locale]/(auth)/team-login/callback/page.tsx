import { provisionLineMember } from "@/actions/members/provision-line-member";
import { auth } from "@/lib/auth";
import { EDITOR_LOGIN_PATH } from "@/lib/session";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// セッション参照のため動的レンダリング
export const dynamic = "force-dynamic";

/**
 * LINE ログイン後の受け口。
 * 会員レコードが無ければ作ってから執筆エリアへ送る。
 * 編集者かどうかの判定は /team-blog 側のガードで行う。
 */
export default async function TeamLoginCallbackPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(EDITOR_LOGIN_PATH);
  }

  await provisionLineMember(session.user.id, session.user.email ?? null);

  redirect("/team-blog");
}
