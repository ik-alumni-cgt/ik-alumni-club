import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { setLocale } from "@/app/web/i18n/set-locale";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  return (
    <div className="w-full max-w-4xl">
      <Suspense fallback={<div>Loading...</div>}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
