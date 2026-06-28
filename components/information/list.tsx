import { InformationCard } from "@/components/information/information-card";
import { ScrollStagger } from "@/components/scroll-animation/scroll-stagger";

type CategoryRef = {
  category: { id: string; name: string; color: string | null } | null;
};

type Information = {
  id: string;
  title: string;
  date: string;
  informationCategories?: CategoryRef[];
};

export function InformationList({ items }: { items: Information[] }) {
  if (items.length === 0) {
    return (
      <p className="text-center text-gray-500">配信までしばらくお待ちください</p>
    );
  }

  return (
    <ScrollStagger className="flex flex-col gap-[30px]" staggerDelay={100}>
      {items.map((item) => (
        <InformationCard
          key={item.id}
          id={item.id}
          date={item.date}
          title={item.title}
          categories={
            item.informationCategories
              ?.map((ic) => ic.category)
              .filter((c): c is NonNullable<typeof c> => c !== null) ?? []
          }
        />
      ))}
    </ScrollStagger>
  );
}
