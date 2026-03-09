"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  availableYears: number[];
  currentYear?: number;
};

export function PastEventYearFilter({ availableYears, currentYear }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handleYearChange = (value: string) => {
    if (value === "all") {
      router.push(pathname);
    } else {
      router.push(`${pathname}?year=${value}`);
    }
  };

  if (availableYears.length === 0) return null;

  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">年度:</span>
      <Select
        value={currentYear?.toString() ?? "all"}
        onValueChange={handleYearChange}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="全期間" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全期間</SelectItem>
          {availableYears.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}年
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
