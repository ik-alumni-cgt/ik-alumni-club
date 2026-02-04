import { Suspense } from "react";
import { MigratedUserLoginForm } from "@/components/migrated-user-login-form";
import { setLocale } from "@/app/web/i18n/set-locale";

export default async function MigrateLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  return (
    <div className="w-full max-w-4xl">
      <Suspense fallback={<div>Loading...</div>}>
        <MigratedUserLoginForm />
      </Suspense>
    </div>
  );
}
