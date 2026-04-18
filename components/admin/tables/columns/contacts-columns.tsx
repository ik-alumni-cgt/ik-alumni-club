"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DateCell } from "@/components/admin/tables/cells/date-cell";
import {
  CONTACT_CATEGORY_LABELS,
  type ContactCategory,
} from "@/components/contact/constants";

export type ContactForTable = {
  id: string;
  name: string;
  subject: string;
  category: string;
  createdAt: string;
};

export const contactsColumns: ColumnDef<ContactForTable>[] = [
  {
    accessorKey: "createdAt",
    header: "受付日時",
    cell: ({ row }) => (
      <DateCell date={row.getValue("createdAt")} showTime />
    ),
  },
  {
    accessorKey: "category",
    header: "カテゴリ",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return (
        CONTACT_CATEGORY_LABELS[category as ContactCategory] ?? category
      );
    },
  },
  {
    accessorKey: "name",
    header: "名前",
  },
  {
    accessorKey: "subject",
    header: "件名",
    cell: ({ row }) => (
      <Link
        href={`/admin/contacts/${row.original.id}`}
        className="text-primary hover:underline"
      >
        {row.getValue("subject")}
      </Link>
    ),
  },
];
