import { Suspense } from "react";
import { LoginForm } from "@/components/login-form/login-form";
import { setLocale } from "@/app/web/i18n/set-locale";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  return (
    <div className="w-full max-w-4xl">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
