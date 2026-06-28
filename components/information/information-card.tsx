import Link from "next/link";

type CategoryBadge = {
  id: string;
  name: string;
  color: string | null;
};

interface InformationCardProps {
  id: string;
  date: string;
  title: string;
  categories?: CategoryBadge[];
}

export function InformationCard({
  id,
  date,
  title,
  categories = [],
}: InformationCardProps) {
  // 日付を "MM.DD" 形式に変換
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${month}.${day}`;
  };

  return (
    <Link href={`/information/${id}`} className="h-full">
      <div className="flex gap-4 md:gap-6 hover:opacity-80 transition-opacity items-center border-2 rounded-[10px] p-4 md:p-6 h-full">
        <div className="flex-shrink-0">
          <div className="bg-red-500 text-white rounded-full w-[60px] h-[60px] md:w-[80px] md:h-[80px] flex items-center justify-center">
            <p className="text-lg md:text-xl font-bold">
              {formatDate(date)}
            </p>
          </div>
        </div>
        <div className="flex-1">
          {categories.length > 0 && (
            <div className="mb-1 flex flex-wrap gap-1.5">
              {categories.map((category) => (
                <span
                  key={category.id}
                  className="inline-block rounded-full px-2 py-0.5 text-xs font-bold text-white"
                  style={{ backgroundColor: category.color ?? "#6B7280" }}
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}
          <p className="text-base md:text-lg font-bold text-black">
            {title}
          </p>
        </div>
      </div>
    </Link>
  );
}
