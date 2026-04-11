import { getSystemAccounts } from "@/data/account";
import { SystemAccountsTable } from "@/components/admin/system-accounts-table";

export default async function SystemAccountsPage() {
  const accounts = await getSystemAccounts();

  const serializedAccounts = accounts.map((account) => ({
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
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">システムアカウント</h1>
        <p className="text-muted-foreground">
          管理者アカウントの一覧・詳細を確認できます
        </p>
      </div>

      {accounts.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">システムアカウントがありません</h3>
            <p className="text-sm text-muted-foreground">
              管理者ロールのアカウントが見つかりませんでした
            </p>
          </div>
        </div>
      ) : (
        <SystemAccountsTable accounts={serializedAccounts} />
      )}
    </div>
  );
}
