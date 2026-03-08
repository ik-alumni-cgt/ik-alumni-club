import { setLocale } from "@/app/web/i18n/set-locale";
import { PdfViewer } from "@/components/newsletters/pdf-viewer";
import { getNewsletter } from "@/data/newsletter";
import { canAccessMemberContent } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { MemberOnlyContent } from "@/components/member-only-content";

export const dynamic = "force-dynamic";

export default async function NewsletterViewerPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  await setLocale(params);
  const { id, locale } = await params;
  const item = await getNewsletter(id);

  if (!item) {
    notFound();
  }

  if (item.isMemberOnly) {
    const isMember = await canAccessMemberContent();
    if (!isMember) {
      return <MemberOnlyContent contentType="Digital Magazine" />;
    }
  }

  if (!item.pdfUrl) {
    redirect(`/${locale}/newsletter/${id}`);
  }

  return (
    <div className="bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-500 min-h-screen -mt-[140px] pt-[140px]">
      <div className="container max-w-full pt-6 pb-16">
        <PdfViewer
          pdfUrl={item.pdfUrl}
          title={item.title}
          issueNumber={item.issueNumber}
          newsletterId={item.id}
        />
      </div>
    </div>
  );
}
