import { MypageCard } from "@/components/mypage/mypage-card";
import { ProfileCompletionBanner } from "@/components/profile-completion-banner";
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

  return (
    <div className="w-full max-w-4xl">
      {/* プロフィール未完成の場合は促進バナーを表示 */}
      {member && member.status === "pending_profile" && (
        <ProfileCompletionBanner className="mb-6" />
      )}

      <MypageCard user={session.user} member={member} />
    </div>
  );
}
