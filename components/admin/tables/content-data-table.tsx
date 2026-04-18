"use client";

import { DataTable } from "@/components/ui/data-table";
import {
  createContentColumns,
  type ContentForTable,
} from "@/components/admin/tables/columns/content-columns";

type Props = {
  data: ContentForTable[];
  editBasePath: string;
  searchPlaceholder?: string;
  toolbar?: React.ReactNode;
  emptyState?: {
    title: string;
    description?: string;
    action?: React.ReactNode;
  };
};

export function ContentDataTable({
  data,
  editBasePath,
  searchPlaceholder = "タイトルで検索...",
  toolbar,
  emptyState,
}: Props) {
  const columns = createContentColumns(editBasePath);

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="title"
      searchPlaceholder={searchPlaceholder}
      toolbar={toolbar}
      emptyState={emptyState}
    />
  );
}
