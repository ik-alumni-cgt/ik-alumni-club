"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { CheckCircle, XCircle, Flag, Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteSponsor } from "@/actions/sponsor";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ImageCell } from "@/components/admin/tables/cells/image-cell";
import { DateCell } from "@/components/admin/tables/cells/date-cell";

export type SponsorForTable = {
  id: string;
  companyName: string | null;
  logoUrl: string | null;
  representativeName: string;
  hasFlag: boolean;
  programConsent: boolean;
  websiteConsent: boolean;
  createdAt: string;
};

function ConsentIcon({ consented }: { consented: boolean }) {
  return consented ? (
    <CheckCircle className="h-4 w-4 text-green-500" />
  ) : (
    <XCircle className="h-4 w-4 text-muted-foreground" />
  );
}

function DeleteSponsorAction({ sponsor }: { sponsor: SponsorForTable }) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteSponsor(sponsor.id);
      toast.success("スポンサー回答を削除しました");
      router.refresh();
    } catch {
      toast.error("削除に失敗しました");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            「{sponsor.companyName}」の回答を削除します。この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>削除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const sponsorsColumns: ColumnDef<SponsorForTable>[] = [
  {
    accessorKey: "logoUrl",
    header: "",
    cell: ({ row }) => (
      <ImageCell
        src={row.original.logoUrl}
        alt={`${row.original.companyName ?? ""}のロゴ`}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="企業名" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.companyName ?? "-"}
      </span>
    ),
  },
  {
    accessorKey: "representativeName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="代表者名" />
    ),
  },
  {
    accessorKey: "hasFlag",
    header: "フラッグ",
    cell: ({ row }) => (
      <Badge variant={row.original.hasFlag ? "default" : "secondary"}>
        <Flag className="mr-1 h-3 w-3" />
        {row.original.hasFlag ? "希望あり" : "希望なし"}
      </Badge>
    ),
  },
  {
    accessorKey: "programConsent",
    header: "プログラム",
    cell: ({ row }) => (
      <ConsentIcon consented={row.original.programConsent} />
    ),
  },
  {
    accessorKey: "websiteConsent",
    header: "HP掲載",
    cell: ({ row }) => (
      <ConsentIcon consented={row.original.websiteConsent} />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="回答日" />
    ),
    cell: ({ row }) => (
      <DateCell date={row.getValue("createdAt")} showTime />
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">操作</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/sponsors/${row.original.id}`}>
            <Eye className="mr-1 h-4 w-4" />
            詳細
          </Link>
        </Button>
        <DeleteSponsorAction sponsor={row.original} />
      </div>
    ),
  },
];
