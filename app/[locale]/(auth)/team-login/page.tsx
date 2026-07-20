import { TeamLoginForm } from "@/components/team-login-form/team-login-form";
import { setLocale } from "@/app/web/i18n/set-locale";

export default async function TeamLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <TeamLoginForm />
      </div>
    </div>
  );
}
