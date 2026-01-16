import { setLocale } from "@/app/web/i18n/set-locale";
import { TermsAgreementForm } from "@/components/register/terms-agreement-form";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  return (
    <div className="w-full max-w-4xl">
      <TermsAgreementForm />
    </div>
  );
}
