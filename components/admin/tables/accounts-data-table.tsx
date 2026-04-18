"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { BulkEmailDialog } from "@/components/admin/bulk-email-dialog";
import {
  accountsColumns,
  type AccountForTable,
} from "@/components/admin/tables/columns/accounts-columns";

type Props = {
  accounts: AccountForTable[];
  toolbar?: React.ReactNode;
};

function getDisplayName(account: AccountForTable) {
  if (account.lastName && account.firstName) {
    return `${account.lastName} ${account.firstName}`;
  }
  return account.userName;
}

export function AccountsDataTable({ accounts, toolbar }: Props) {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<
    { id: string; email: string; name: string }[]
  >([]);

  return (
    <>
      <DataTable
        columns={accountsColumns}
        data={accounts}
        enableRowSelection
        searchKey="name"
        searchPlaceholder="氏名で検索..."
        toolbar={toolbar}
        emptyState={{
          title: "該当する会員がいません",
          description: "フィルター条件に合う会員が見つかりませんでした",
        }}
        bulkActions={(table) => {
          const selected = table
            .getFilteredSelectedRowModel()
            .rows.map((row) => ({
              id: row.original.id,
              email: row.original.email || row.original.userEmail,
              name: getDisplayName(row.original),
            }));

          return (
            <Button
              size="sm"
              onClick={() => {
                setSelectedMembers(selected);
                setEmailDialogOpen(true);
              }}
            >
              <Mail className="mr-1.5 h-4 w-4" />
              メール送信
            </Button>
          );
        }}
      />

      <BulkEmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        selectedMembers={selectedMembers}
        onSendComplete={() => setSelectedMembers([])}
      />
    </>
  );
}
