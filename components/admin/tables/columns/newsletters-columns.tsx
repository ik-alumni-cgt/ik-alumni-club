"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PublishedBadgeCell } from "@/components/admin/tables/cells/published-badge-cell";
import { MemberOnlyBadgeCell } from "@/components/admin/tables/cells/member-only-badge-cell";
import { DateCell } from "@/components/admin/tables/cells/date-cell";

export type NewsletterForTable = {
  id: string;
  issueNumber: number;
  title: string;
  published: boolean;
  isMemberOnly: boolean;
  category: string | null;
  publishedAt: string | null;
  authorName: string | null;
  pdfUrl: string | null;
};

function getCategoryLabel(category: string | null) {
  switch (category) {
    case "regular":
      return "定期号";
    case "special":
      return "特別号";
    case "extra":
      return "号外";
    default:
      return null;
  }
}

export const newslettersColumns: ColumnDef<NewsletterForTable>[] = [
  {
    accessorKey: "issueNumber",
    header: "号数",
    cell: ({ row }) => (
      <span className="font-medium">第{row.original.issueNumber}号</span>
    ),
  },
  {
    accessorKey: "title",
    header: "タイトル",
    cell: ({ row }) => (
      <span className="font-medium line-clamp-2 max-w-[300px]">
        {row.getValue("title")}
      </span>
    ),
  },
  {
    accessorKey: "published",
    header: "公開",
    cell: ({ row }) => (
      <PublishedBadgeCell published={row.original.published} />
    ),
  },
  {
    accessorKey: "isMemberOnly",
    header: "限定",
    cell: ({ row }) => (
      <MemberOnlyBadgeCell isMemberOnly={row.original.isMemberOnly} />
    ),
  },
  {
    accessorKey: "category",
    header: "カテゴリ",
    cell: ({ row }) => {
      const label = getCategoryLabel(row.original.category);
      return label ? (
        <Badge variant="outline">{label}</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "publishedAt",
    header: "発行日",
    cell: ({ row }) => <DateCell date={row.original.publishedAt} />,
  },
  {
    accessorKey: "authorName",
    header: "作成者",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.authorName ?? "-"}
      </span>
    ),
  },
  {
    accessorKey: "pdfUrl",
    header: "PDF",
    cell: ({ row }) =>
      row.original.pdfUrl ? (
        <a
          href={row.original.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-sm"
        >
          PDF版あり
        </a>
      ) : (
        <span className="text-muted-foreground">-</span>
      ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">操作</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/newsletters/${row.original.id}`}>編集</Link>
        </Button>
      </div>
    ),
  },
];
