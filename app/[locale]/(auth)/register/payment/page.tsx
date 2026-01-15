import { Suspense } from "react";
import { setLocale } from "@/app/web/i18n/set-locale";
import { PaymentForm } from "@/components/register/payment-form";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function PaymentFormFallback() {
  return (
    <Card>
      <CardContent className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </CardContent>
    </Card>
  );
}

export default async function RegisterPaymentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  return (
    <div className="w-full max-w-4xl">
      <Suspense fallback={<PaymentFormFallback />}>
        <PaymentForm />
      </Suspense>
    </div>
  );
}
