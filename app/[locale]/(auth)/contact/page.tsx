import { setLocale } from "@/app/web/i18n/set-locale";
import { ContactForm } from "@/components/contact/contact-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  let defaultName: string | undefined;
  let defaultEmail: string | undefined;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session) {
      defaultName = session.user.name ?? undefined;
      defaultEmail = session.user.email ?? undefined;
    }
  } catch {
    // 未ログインの場合は何もしない
  }

  return (
    <div className="w-full max-w-4xl">
      <ContactForm defaultName={defaultName} defaultEmail={defaultEmail} />
    </div>
  );
}
