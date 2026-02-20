import { setLocale } from "@/app/web/i18n/set-locale";
import { TermsAgreementForm } from "@/components/register/terms-agreement-form";
import { RegistrationWaitingMessage } from "@/components/register/registration-waiting-message";

/** 新規登録の受付を開始しているか（true: 受付中, false/未設定: 受付待ち） */
const isRegistrationOpen = process.env.NEXT_PUBLIC_REGISTRATION_OPEN === "true";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  if (!isRegistrationOpen) {
    return <RegistrationWaitingMessage />;
  }

  return (
    <div className="w-full max-w-4xl">
      <TermsAgreementForm />
    </div>
  );
}
