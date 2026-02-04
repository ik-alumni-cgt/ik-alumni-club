import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { setLocale } from "@/app/web/i18n/set-locale";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  return (
    <div className="w-full max-w-4xl">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
