import { setLocale } from "@/app/web/i18n/set-locale";
import { ProfileDetailCard } from "@/components/profile/profile-detail-card";
import { getCurrentMember } from "@/actions/members/get-member";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  const memberResult = await getCurrentMember();

  if (!memberResult.success || !memberResult.data) {
    redirect("/mypage");
  }

  const member = memberResult.data;

  // プロフィールが未入力の場合は編集ページにリダイレクト
  if (member.status === "pending_profile") {
    redirect("/profile/edit");
  }

  return (
    <div className="w-full max-w-4xl">
      <ProfileDetailCard member={member} />
    </div>
  );
}
