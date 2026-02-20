import { redirect } from "next/navigation";
import { setLocale } from "@/app/web/i18n/set-locale";
import { RegisterAuthForm } from "@/components/register/register-auth-form";

const isRegistrationOpen = process.env.NEXT_PUBLIC_REGISTRATION_OPEN === "true";

export default async function RegisterAuthPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  if (!isRegistrationOpen) {
    redirect("/register/terms");
  }

  return (
    <div className="w-full max-w-4xl">
      <RegisterAuthForm />
    </div>
  );
}
