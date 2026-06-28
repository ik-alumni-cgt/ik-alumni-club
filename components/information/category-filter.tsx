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
  categories: { slug: string; name: string }[];
  currentSlug?: string;
};

export function InformationCategoryFilter({ categories, currentSlug }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (value: string) => {
    if (value === "all") {
      router.push(pathname);
    } else {
      router.push(`${pathname}?category=${value}`);
    }
  };

  if (categories.length === 0) return null;

  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">カテゴリ:</span>
      <Select value={currentSlug ?? "all"} onValueChange={handleChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="すべて" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべて</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.slug} value={category.slug}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
