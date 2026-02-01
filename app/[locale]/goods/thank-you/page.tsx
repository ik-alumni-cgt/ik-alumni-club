import { setLocale } from "@/app/web/i18n/set-locale";
import { GoodsThankYouContent } from "./goods-thank-you-content";

export default async function GoodsThankYouPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  return <GoodsThankYouContent />;
}
