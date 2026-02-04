import { MypageCard } from "@/components/mypage/mypage-card";
import { ProfileCompletionBanner } from "@/components/profile-completion-banner";
import { PaymentRegistrationBanner } from "@/components/payment-registration-banner";
import { verifySession } from "@/lib/session";
import { getCurrentMember } from "@/actions/members/get-member";
import { setLocale } from "@/app/web/i18n/set-locale";

export default async function MypagePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const session = await verifySession();

  // member情報を取得
  const memberResult = await getCurrentMember();
  const member = memberResult.success && memberResult.data ? memberResult.data : null;

  // 移行ユーザーで決済未完了の場合にバナー表示
  const showPaymentBanner =
    member?.isMigrated === true && member?.paymentStatus === "pending";

  // 決済完了済みでプロフィール未完成の場合にバナー表示
  const showProfileBanner =
    !showPaymentBanner && member?.status === "pending_profile";

  return (
    <div className="w-full max-w-4xl">
      {/* 移行ユーザーで決済未完了の場合は決済登録促進バナーを表示 */}
      {showPaymentBanner && (
        <PaymentRegistrationBanner className="mb-6" planId={member?.planId} />
      )}

      {/* プロフィール未完成の場合は促進バナーを表示（決済バナーと排他） */}
      {showProfileBanner && <ProfileCompletionBanner className="mb-6" />}

      <MypageCard user={session.user} member={member} />
    </div>
  );
}
