import { InformationCard } from "@/components/information/information-card";
import { ScrollStagger } from "@/components/scroll-animation/scroll-stagger";

type Information = {
  id: string;
  title: string;
  date: string;
  content: string;
  published: boolean;
  isMemberOnly: boolean;
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
        />
      ))}
    </ScrollStagger>
  );
}
