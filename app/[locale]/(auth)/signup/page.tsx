import { SignupForm } from "@/components/signup-form/signup-form";
import { setLocale } from "@/app/web/i18n/set-locale";

export default async function SignupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  return (
    <div className="w-full max-w-4xl">
      <SignupForm />
    </div>
  );
}
