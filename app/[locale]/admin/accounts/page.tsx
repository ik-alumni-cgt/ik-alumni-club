import { getAllAccounts } from "@/data/account";
import { SendTestEmailButton } from "@/components/admin/send-test-email-button";
import { AccountFilters } from "@/components/admin/account-filters";
import { AccountsTable } from "@/components/admin/accounts-table";
import type { MemberStatus } from "@/types/member";
import { Suspense } from "react";

type PaymentStatus = "pending" | "completed" | "failed" | "canceled";

type SearchParams = {
  status?: string;
  paymentStatus?: string;
  isMigrated?: string;
};

const VALID_STATUSES: MemberStatus[] = ["pending_profile", "active", "inactive"];
const VALID_PAYMENT_STATUSES: PaymentStatus[] = ["pending", "completed", "failed", "canceled"];

export default async function AdminAccountsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const status = VALID_STATUSES.includes(params.status as MemberStatus)
    ? (params.status as MemberStatus)
    : undefined;

  const paymentStatus = VALID_PAYMENT_STATUSES.includes(params.paymentStatus as PaymentStatus)
    ? (params.paymentStatus as PaymentStatus)
    : undefined;

  const isMigrated =
    params.isMigrated === "migrated"
      ? true
      : params.isMigrated === "existing"
        ? false
        : undefined;

  const accounts = await getAllAccounts({ status, paymentStatus, isMigrated });

  // Server -> Client のシリアライズ（Date -> string）
  const serializedAccounts = accounts.map((account) => ({
    id: account.id,
    lastName: account.lastName,
    firstName: account.firstName,
    email: account.email,
    userName: account.user.name,
    userEmail: account.user.email,
    planDisplayName: account.plan?.displayName ?? null,
    role: account.role,
    status: account.status,
    paymentStatus: account.paymentStatus,
    isMigrated: account.isMigrated,
    hasLoginSetup: account.hasLoginSetup,
    createdAt: account.createdAt.toISOString(),
  }));

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">会員管理</h1>
          <p className="text-muted-foreground">
            会員の一覧・詳細・編集・削除ができます
          </p>
        </div>
        <SendTestEmailButton />
      </div>

      <div className="mb-4">
        <Suspense>
          <AccountFilters />
        </Suspense>
      </div>

      {accounts.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">該当する会員がいません</h3>
            <p className="text-sm text-muted-foreground">
              フィルター条件に合う会員が見つかりませんでした
            </p>
          </div>
        </div>
      ) : (
        <AccountsTable accounts={serializedAccounts} />
      )}
    </div>
  );
}
