import { setLocale } from "@/app/web/i18n/set-locale";
import { PrivacyContent } from "@/components/privacy/privacy-content";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  return (
    <div className="w-full max-w-4xl">
      <PrivacyContent />
    </div>
  );
}
