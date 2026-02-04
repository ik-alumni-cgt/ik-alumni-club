import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { EmailRegistrationForm } from "@/components/email-registration-form";

export default async function RegisterEmailPage({
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

  // 既に有効なメールアドレスがある場合はスキップ
  if (!session.user.email.endsWith("@line.me")) {
    const paymentUrl = planId
      ? `/register/payment?planId=${planId}`
      : "/register/payment";
    redirect(paymentUrl);
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <EmailRegistrationForm
          userId={session.user.id}
          planId={planId}
        />
      </div>
    </div>
  );
}
