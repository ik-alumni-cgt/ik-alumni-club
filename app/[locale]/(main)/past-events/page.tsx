import { setLocale } from "@/app/web/i18n/set-locale";
import { PastEventTimeline } from "@/components/past-event/timeline";
import { PastEventYearFilter } from "@/components/past-event/year-filter";
import { getPublishedPastEvents } from "@/data/past-event";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function PastEventsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ year?: string }>;
}) {
  await setLocale(params);
  const t = await getTranslations("Contents");
  const { year } = await searchParams;
  const allItems = await getPublishedPastEvents();

  const filteredItems = year
    ? allItems.filter((item) => {
        const eventYear = new Date(item.eventDate).getFullYear();
        return eventYear === parseInt(year);
      })
    : allItems;

  const availableYears = [
    ...new Set(allItems.map((item) => new Date(item.eventDate).getFullYear())),
  ].sort((a, b) => b - a);

  return (
    <div className="container mx-auto px-4 pt-10 pb-32">
      <h1 className="main-text mb-10">{t("pastEvents")}</h1>
      <PastEventYearFilter
        availableYears={availableYears}
        currentYear={year ? parseInt(year) : undefined}
      />
      <PastEventTimeline items={filteredItems} />
    </div>
  );
}
