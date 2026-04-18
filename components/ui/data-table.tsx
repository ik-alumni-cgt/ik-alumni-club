"use client";

import { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  enableRowSelection?: boolean;
  pageSize?: number;
  toolbar?: React.ReactNode;
  bulkActions?: (table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode;
  hideHeader?: boolean;
  onRowClick?: (row: TData) => void;
  emptyState?: {
    title: string;
    description?: string;
    action?: React.ReactNode;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "検索...",
  enableRowSelection = false,
  pageSize = 20,
  toolbar,
  hideHeader = false,
  bulkActions,
  onRowClick,
  emptyState,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <div className="space-y-4">
      {(searchKey || toolbar || (bulkActions && table.getFilteredSelectedRowModel().rows.length > 0)) && (
        <div className="flex items-center gap-3">
          {searchKey && (
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="max-w-sm bg-white"
            />
          )}
          {toolbar && <div className="ml-auto">{toolbar}</div>}
          {bulkActions && table.getFilteredSelectedRowModel().rows.length > 0 && (
            <div className="flex items-center gap-3 rounded-md border bg-muted/50 px-4 py-2">
              <span className="text-sm font-medium">
                {table.getFilteredSelectedRowModel().rows.length}件選択中
                （全{table.getFilteredRowModel().rows.length}件中）
              </span>
              {bulkActions(table)}
            </div>
          )}
        </div>
      )}

      <div className="rounded-md border bg-white">
        <Table style={{ tableLayout: columns.some((col) => (col.meta as { widthPercent?: number } | undefined)?.widthPercent) ? "fixed" : undefined }}>
          {columns.some((col) => (col.meta as { widthPercent?: number } | undefined)?.widthPercent) && (
            <colgroup>
              {columns.map((col, i) => {
                const wp = (col.meta as { widthPercent?: number } | undefined)?.widthPercent;
                return <col key={i} style={wp ? { width: `${wp}%` } : undefined} />;
              })}
            </colgroup>
          )}
          {!hideHeader && (
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
          )}
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : undefined}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyState ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-8">
                      <h3 className="text-lg font-semibold">
                        {emptyState.title}
                      </h3>
                      {emptyState.description && (
                        <p className="text-sm text-muted-foreground">
                          {emptyState.description}
                        </p>
                      )}
                      {emptyState.action}
                    </div>
                  ) : (
                    "データがありません"
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
