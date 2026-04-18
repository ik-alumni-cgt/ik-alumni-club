import { getSystemAccounts } from "@/data/account";
import { DataTable } from "@/components/ui/data-table";
import {
  systemAccountsColumns,
  type SystemAccountForTable,
} from "@/components/admin/tables/columns/system-accounts-columns";

export default async function SystemAccountsPage() {
  const accounts = await getSystemAccounts();

  const data: SystemAccountForTable[] = accounts.map((account) => ({
    id: account.id,
    lastName: account.lastName,
    firstName: account.firstName,
    email: account.email,
    userName: account.user.name,
    userEmail: account.user.email,
    status: account.status,
    hasLoginSetup: account.hasLoginSetup,
    createdAt: account.createdAt.toISOString(),
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">システムアカウント</h1>
        <p className="text-muted-foreground">
          管理者アカウントの一覧・詳細を確認できます
        </p>
      </div>

      <DataTable
        columns={systemAccountsColumns}
        data={data}
        searchKey="name"
        searchPlaceholder="氏名で検索..."
        emptyState={{
          title: "システムアカウントがありません",
          description: "管理者ロールのアカウントが見つかりませんでした",
        }}
      />
    </div>
  );
}
