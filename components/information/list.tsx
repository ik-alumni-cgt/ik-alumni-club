import { InformationCard } from "@/components/information/information-card";

type Information = {
  id: string;
  title: string;
  date: string;
  content: string;
  published: boolean;
  isMemberOnly: boolean;
};

export function InformationList({ items }: { items: Information[] }) {
  return (
    <div className="flex flex-col gap-[30px]">
      {items.length === 0 ? (
        <p className="text-center text-gray-500">お知らせはありません</p>
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
  );
}
