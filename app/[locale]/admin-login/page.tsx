import { AdminLoginForm } from "@/components/admin-login-form/admin-login-form";
import { setLocale } from "@/app/web/i18n/set-locale";

export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <AdminLoginForm />
      </div>
    </div>
  );
}
