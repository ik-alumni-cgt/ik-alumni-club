import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { PublishedBadgeCell } from "@/components/admin/tables/cells/published-badge-cell";
import { MemberOnlyBadgeCell } from "@/components/admin/tables/cells/member-only-badge-cell";
import { DateCell } from "@/components/admin/tables/cells/date-cell";

export type ContentCategory = {
  id: string;
  name: string;
};

export type ContentForTable = {
  id: string;
  title: string;
  published: boolean;
  isMemberOnly: boolean;
  updatedAt: string;
  imageUrl?: string | null;
  categories?: ContentCategory[];
};

function CategoryBadges({ categories }: { categories: ContentCategory[] }) {
  if (categories.length === 0) {
    return <span className="text-xs text-muted-foreground">-</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {categories.map((category) => (
        <Badge key={category.id} variant="outline" className="text-xs">
          {category.name}
        </Badge>
      ))}
    </div>
  );
}

export function createContentColumns(): ColumnDef<ContentForTable>[] {
  return [
    {
      accessorKey: "title",
      header: "タイトル",
      meta: { widthPercent: 40 },
      cell: ({ row }) => (
        <div className="py-1">
          <span className="block font-medium line-clamp-2">
            {row.getValue("title")}
          </span>
          {row.original.categories && row.original.categories.length > 0 && (
            <div className="mt-1.5 md:hidden">
              <CategoryBadges categories={row.original.categories} />
            </div>
          )}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 md:hidden">
            <PublishedBadgeCell published={row.original.published} />
            <MemberOnlyBadgeCell isMemberOnly={row.original.isMemberOnly} />
          </div>
          <div className="mt-1 md:hidden">
            <DateCell date={row.original.updatedAt} />
          </div>
        </div>
      ),
    },
    {
      id: "categories",
      header: "カテゴリー",
      meta: { widthPercent: 20, hideOnMobile: true },
      cell: ({ row }) => (
        <CategoryBadges categories={row.original.categories ?? []} />
      ),
    },
    {
      id: "status",
      header: "ステータス",
      meta: { widthPercent: 20, hideOnMobile: true },
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <PublishedBadgeCell published={row.original.published} />
          <MemberOnlyBadgeCell isMemberOnly={row.original.isMemberOnly} />
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "更新日",
      meta: { widthPercent: 20, hideOnMobile: true },
      cell: ({ row }) => <DateCell date={row.getValue("updatedAt")} />,
    },
  ];
}
