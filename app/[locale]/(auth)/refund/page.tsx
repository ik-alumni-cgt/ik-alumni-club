import { setLocale } from "@/app/web/i18n/set-locale";
import { RefundContent } from "@/components/refund/refund-content";

export default async function RefundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  return (
    <div className="w-full max-w-4xl">
      <RefundContent />
    </div>
  );
}
