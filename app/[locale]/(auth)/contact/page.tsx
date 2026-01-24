import { setLocale } from "@/app/web/i18n/set-locale";
import { ContactContent } from "@/components/contact/contact-content";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  return (
    <div className="w-full max-w-4xl">
      <ContactContent />
    </div>
  );
}
