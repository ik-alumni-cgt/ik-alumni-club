import { ContentsHeader } from "@/components/contents/contents-header";
import { ContentsCard } from "@/components/contents/contents-card";
import { getTranslations } from "next-intl/server";
import { getLatestNewsletters } from "@/data/newsletter";
import Link from "next/link";
import { format } from "date-fns";

export async function NewsLettersContents() {
  const t = await getTranslations("Contents");
  const newsletters = await getLatestNewsletters(3);

  return (
    <div className="flex flex-col">
      <ContentsHeader title={t("newsletters")} viewAllHref="/newsletter" />
      <div className="flex flex-col gap-[30px] mt-[60px]">
        {newsletters.length === 0 ? (
          <p>配信までしばらくお待ちください</p>
        ) : (
          newsletters.map((newsletter) => (
            <Link key={newsletter.id} href={`/newsletter/${newsletter.id}`}>
              <ContentsCard
                title={`第${newsletter.issueNumber}号: ${newsletter.title}`}
                date={
                  newsletter.publishedAt
                    ? format(new Date(newsletter.publishedAt), "yyyy/MM/dd")
                    : format(new Date(newsletter.createdAt), "yyyy/MM/dd")
                }
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
