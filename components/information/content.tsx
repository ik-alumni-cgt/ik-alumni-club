import { ContentsHeader } from "@/components/contents/contents-header";
import { InformationCard } from "@/components/information/information-card";
import { getTranslations } from "next-intl/server";
import { getInformations } from "@/data/information";

export async function InformationContents() {
  const t = await getTranslations("Contents");
  const informations = await getInformations();

  // 最新3件のお知らせを取得
  const items = informations.slice(0, 3);

  return (
    <div className="flex flex-col">
      <div className="text-black">
        <ContentsHeader title={t("information")} viewAllHref="/information" />
      </div>
      <div className="flex flex-col md:grid md:grid-cols-3 gap-[30px] mt-[60px]">
        {items.length === 0 ? (
          <p className="text-black">配信までしばらくお待ちください</p>
        ) : (
          items.map((item) => (
            <InformationCard
              key={item.id}
              id={item.id}
              date={item.date}
              title={item.title}
            />
          ))
        )}
      </div>
    </div>
  );
}
