import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { provisionTeamMember } from "@/actions/members/provision-team-member";

// セッション参照のため動的レンダリング
export const dynamic = "force-dynamic";

export default async function TeamLoginCallbackPage() {
  // LINE ログイン後のセッションを取得
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    // セッションがない場合はチームログイン入口へ戻す
    redirect("/team-login");
  }

  const result = await provisionTeamMember(
    session.user.id,
    session.user.email ?? null
  );

  // 承認済みの team_member は執筆エリアへ
  if (result.outcome === "active_team_member") {
    redirect("/team-blog");
  }

  // 既存のアクティブ会員（team_member 以外）は通常のマイページへ
  if (result.outcome === "active_other") {
    redirect("/mypage");
  }

  // 承認待ち
  redirect("/team-login/pending");
}
