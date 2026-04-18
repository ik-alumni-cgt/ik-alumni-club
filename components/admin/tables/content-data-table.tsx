"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import {
  createContentColumns,
  type ContentForTable,
} from "@/components/admin/tables/columns/content-columns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ContentDetailPanel } from "@/components/admin/tables/content-detail-panel";

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
  const columns = createContentColumns();
  const [selectedContent, setSelectedContent] =
    useState<ContentForTable | null>(null);

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        searchKey="title"
        searchPlaceholder={searchPlaceholder}
        hideHeader
        toolbar={toolbar}
        emptyState={emptyState}
        onRowClick={setSelectedContent}
      />

      <Sheet
        open={selectedContent !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedContent(null);
        }}
      >
        <SheetContent
          side="right"
          className="font-[family-name:var(--font-geist-sans)] sm:max-w-md"
          hideOverlay
        >
          <SheetHeader>
            <SheetTitle>コンテンツ詳細</SheetTitle>
            <SheetDescription className="sr-only">
              選択したコンテンツの詳細情報
            </SheetDescription>
          </SheetHeader>
          {selectedContent && (
            <div className="px-4 pb-4">
              <ContentDetailPanel
                content={selectedContent}
                editBasePath={editBasePath}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
