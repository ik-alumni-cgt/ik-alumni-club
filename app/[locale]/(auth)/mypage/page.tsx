import { MypageCard } from "@/components/mypage/mypage-card";
import { MembershipCardImage } from "@/components/mypage/membership-card-image";
import { SupportersClubMenu } from "@/components/mypage/supporters-club-menu";
import { ProfileCompletionBanner } from "@/components/profile-completion-banner";
import { PaymentRegistrationBanner } from "@/components/payment-registration-banner";
import { SponsorFormBanner } from "@/components/sponsor-form-banner";
import { verifySession } from "@/lib/session";
import { getCurrentMember } from "@/actions/members/get-member";
import { setLocale } from "@/app/web/i18n/set-locale";
import { MemberPlan, PlanCode } from "@/types/member-plan";

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

  // 法人会員でスポンサーフォーム未回答の場合にバナー表示
  const plan = member?.plan as MemberPlan | null;
  const showSponsorFormBanner =
    !showPaymentBanner &&
    !showProfileBanner &&
    plan?.isBusinessPlan === true &&
    member?.sponsorFormCompleted === false;

  return (
    <div className="w-full max-w-4xl">
      {/* 移行ユーザーで決済未完了の場合は決済登録促進バナーを表示 */}
      {showPaymentBanner && (
        <PaymentRegistrationBanner className="mb-6" planId={member?.planId} />
      )}

      {/* プロフィール未完成の場合は促進バナーを表示（決済バナーと排他） */}
      {showProfileBanner && <ProfileCompletionBanner className="mb-6" />}

      {/* 法人会員でスポンサーフォーム未回答の場合 */}
      {showSponsorFormBanner && <SponsorFormBanner className="mb-6" />}

      {/* プラン設定済みの場合は会員カード画像を表示 */}
      {(member?.plan as MemberPlan | null)?.planCode && (
        <MembershipCardImage
          planCode={(member!.plan as MemberPlan).planCode as PlanCode}
        />
      )}

      <SupportersClubMenu />

      <MypageCard user={session.user} member={member} />
    </div>
  );
}
