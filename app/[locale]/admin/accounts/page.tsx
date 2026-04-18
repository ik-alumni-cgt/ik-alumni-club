import { getAllAccounts } from "@/data/account";
import { SendTestEmailButton } from "@/components/admin/send-test-email-button";
import { AccountFilters } from "@/components/admin/account-filters";
import { AccountsDataTable } from "@/components/admin/tables/accounts-data-table";
import type { MemberStatus } from "@/types/member";
import type { AccountForTable } from "@/components/admin/tables/columns/accounts-columns";
import { Suspense } from "react";

type PaymentStatus = "pending" | "completed" | "failed" | "canceled";

type SearchParams = {
  status?: string;
  paymentStatus?: string;
  isMigrated?: string;
};

const VALID_STATUSES: MemberStatus[] = [
  "pending_profile",
  "active",
  "inactive",
];
const VALID_PAYMENT_STATUSES: PaymentStatus[] = [
  "pending",
  "completed",
  "failed",
  "canceled",
];

export default async function AdminAccountsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const status = VALID_STATUSES.includes(params.status as MemberStatus)
    ? (params.status as MemberStatus)
    : undefined;

  const paymentStatus = VALID_PAYMENT_STATUSES.includes(
    params.paymentStatus as PaymentStatus
  )
    ? (params.paymentStatus as PaymentStatus)
    : undefined;

  const isMigrated =
    params.isMigrated === "migrated"
      ? true
      : params.isMigrated === "existing"
        ? false
        : undefined;

  const accounts = await getAllAccounts({ status, paymentStatus, isMigrated });

  const data: AccountForTable[] = accounts.map((account) => ({
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

      <AccountsDataTable accounts={data} />
    </div>
  );
}
