import { setLocale } from "@/app/web/i18n/set-locale";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { getCurrentMember } from "@/actions/members/get-member";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfileEditPage({
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

  return (
    <div className="w-full max-w-4xl">
      <ProfileEditForm member={member} />
    </div>
  );
}
