import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

type PaymentRegistrationBannerProps = {
  className?: string;
  planId?: number | null;
};

export function PaymentRegistrationBanner({
  className,
  planId,
}: PaymentRegistrationBannerProps) {
  const paymentUrl = planId
    ? `/register/payment?planId=${planId}`
    : "/register/payment";

  return (
    <Alert variant="default" className={cn("border-amber-200 bg-amber-50", className)}>
      <CreditCard className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">
        次年度のお支払いのお願い
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3 text-amber-700">
          初年度のサポーターズクラブは3/31までとなります。
          引き続きサポーターズクラブを応援してくださる方は、こちらからお支払いをお願いします。
        </p>
        <Button asChild size="sm">
          <Link href={paymentUrl}>お支払いへ進む</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
