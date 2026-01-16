import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createMemberAfterSignup } from "@/actions/members/create-member";

export default async function RegisterCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ planId?: string }>;
}) {
  const { planId } = await searchParams;

  // セッションからユーザー情報を取得
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    // セッションがない場合は認証ページへリダイレクト
    redirect("/register/auth");
  }

  // memberレコードを作成
  const memberResult = await createMemberAfterSignup(
    session.user.id,
    session.user.email,
    planId ? parseInt(planId) : undefined
  );

  if (!memberResult.success) {
    console.error("Failed to create member after social login:", memberResult.error);
  }

  // 支払いページへリダイレクト（planIdも渡す）
  const paymentUrl = planId
    ? `/register/payment?planId=${planId}`
    : "/register/payment";

  redirect(paymentUrl);
}
