import { setLocale } from "@/app/web/i18n/set-locale";
import { LegalContent } from "@/components/legal/legal-content";

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  return (
    <div className="w-full max-w-4xl">
      <LegalContent />
    </div>
  );
}
