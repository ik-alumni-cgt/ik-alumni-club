import { setLocale } from "@/app/web/i18n/set-locale";
import { PaymentForm } from "@/components/register/payment-form";

export default async function RegisterPaymentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  return (
    <div className="w-full max-w-4xl">
      <PaymentForm />
    </div>
  );
}
