import { setLocale } from "@/app/web/i18n/set-locale";
import { RegisterAuthForm } from "@/components/register/register-auth-form";

export default async function RegisterAuthPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  return (
    <div className="w-full max-w-4xl">
      <RegisterAuthForm />
    </div>
  );
}
