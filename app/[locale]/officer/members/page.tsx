import { getAllAccounts } from "@/data/account";
import { WelcomeGiftCheckbox } from "@/components/officer/welcome-gift-checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Suspense } from "react";

type PaymentStatus = "pending" | "completed" | "failed" | "canceled";

type SearchParams = {
  paymentStatus?: string;
};

const VALID_PAYMENT_STATUSES: PaymentStatus[] = [
  "pending",
  "completed",
  "failed",
  "canceled",
];

function ProfileStatusBadge({ status }: { status: string | null }) {
  if (status === "pending_profile") {
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        プロフィール未登録
      </Badge>
    );
  }
  return null;
}

function MembershipTypeBadge({ isMigrated }: { isMigrated: boolean }) {
  if (isMigrated) {
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
        継続
      </Badge>
    );
  }
  return (
    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
      新規
    </Badge>
  );
}

function PaymentStatusBadge({ status }: { status: string | null }) {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          入金済
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          未入金
        </Badge>
      );
    case "failed":
      return <Badge variant="destructive">失敗</Badge>;
    case "canceled":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          キャンセル
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-muted-foreground">
          -
        </Badge>
      );
  }
}

function PaymentFilter({ current }: { current: string }) {
  return (
    <form method="GET" className="flex items-center gap-2">
      <span className="text-sm font-medium whitespace-nowrap">入金状況:</span>
      <Select name="paymentStatus" defaultValue={current}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="入金状況" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべて</SelectItem>
          <SelectItem value="completed">入金済</SelectItem>
          <SelectItem value="pending">未入金</SelectItem>
          <SelectItem value="failed">失敗</SelectItem>
          <SelectItem value="canceled">キャンセル</SelectItem>
        </SelectContent>
      </Select>
    </form>
  );
}

type Account = Awaited<ReturnType<typeof getAllAccounts>>[number];

function buildAddress(account: Account): string {
  const parts = [
    account.prefecture,
    account.city,
    account.address,
    account.building,
  ].filter(Boolean);
  if (parts.length === 0) return "-";
  return `〒${account.postalCode ?? ""} ${parts.join("")}`;
}

function buildName(account: Account): string {
  return account.lastName && account.firstName
    ? `${account.lastName} ${account.firstName}`
    : account.user.name;
}

/** スマホ用カードリスト */
function MemberCardList({ accounts }: { accounts: Account[] }) {
  return (
    <div className="space-y-3">
      {accounts.map((account) => {
        const fullName = buildName(account);
        const address = buildAddress(account);

        return (
          <div
            key={account.id}
            className="rounded-lg border bg-white p-4 shadow-sm"
          >
            {/* 氏名 + バッジ行 */}
            <div className="mb-3 flex items-start justify-between gap-2">
              <span className="text-base font-semibold leading-tight">
                {fullName}
              </span>
              <div className="flex shrink-0 flex-wrap gap-1">
                <MembershipTypeBadge isMigrated={account.isMigrated} />
                <PaymentStatusBadge status={account.paymentStatus} />
                <ProfileStatusBadge status={account.status} />
              </div>
            </div>

            {/* 会員種別 */}
            <div className="mb-2 text-sm text-muted-foreground">
              {account.plan?.displayName ?? "-"}
            </div>

            {/* 連絡先 */}
            <dl className="space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-muted-foreground">
                  メール
                </dt>
                <dd className="break-all">
                  {account.email ?? account.user.email}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-muted-foreground">
                  電話
                </dt>
                <dd>{account.phoneNumber ?? "-"}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-muted-foreground">住所</dt>
                <dd className="text-muted-foreground">{address}</dd>
              </div>
            </dl>

            {/* 初回特典 */}
            <div className="mt-3 flex items-center gap-2 border-t pt-3">
              <WelcomeGiftCheckbox
                memberId={account.id}
                initialChecked={account.welcomeGiftSent}
              />
              <span className="text-sm font-medium">初回特典郵送済み</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** PC用テーブル */
function MemberTableDesktop({ accounts }: { accounts: Account[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>氏名</TableHead>
            <TableHead>メールアドレス</TableHead>
            <TableHead>電話番号</TableHead>
            <TableHead>住所</TableHead>
            <TableHead>会員種別</TableHead>
            <TableHead>継続/新規</TableHead>
            <TableHead>入金状況</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead className="text-center">初回特典郵送済</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => {
            const fullName = buildName(account);
            const address = buildAddress(account);

            return (
              <TableRow key={account.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {fullName}
                </TableCell>
                <TableCell className="text-sm">
                  {account.email ?? account.user.email}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {account.phoneNumber ?? "-"}
                </TableCell>
                <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                  {address}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {account.plan?.displayName ?? "-"}
                </TableCell>
                <TableCell>
                  <MembershipTypeBadge isMigrated={account.isMigrated} />
                </TableCell>
                <TableCell>
                  <PaymentStatusBadge status={account.paymentStatus} />
                </TableCell>
                <TableCell>
                  <ProfileStatusBadge status={account.status} />
                </TableCell>
                <TableCell className="text-center">
                  <WelcomeGiftCheckbox
                    memberId={account.id}
                    initialChecked={account.welcomeGiftSent}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

async function MembersContent({
  paymentStatus,
}: {
  paymentStatus: PaymentStatus | undefined;
}) {
  const accounts = await getAllAccounts({
    paymentStatus,
  });

  if (accounts.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <h3 className="text-lg font-semibold">該当する会員がいません</h3>
          <p className="text-sm text-muted-foreground">
            フィルター条件に合う会員が見つかりませんでした
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* スマホ: カード表示 */}
      <div className="md:hidden">
        <MemberCardList accounts={accounts} />
      </div>

      {/* PC: テーブル表示 */}
      <div className="hidden md:block">
        <MemberTableDesktop accounts={accounts} />
      </div>
    </>
  );
}

export default async function OfficerMembersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const paymentStatus = VALID_PAYMENT_STATUSES.includes(
    params.paymentStatus as PaymentStatus
  )
    ? (params.paymentStatus as PaymentStatus)
    : undefined;

  const currentFilter = params.paymentStatus ?? "all";

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold sm:text-2xl">会員一覧</h2>
        <p className="text-sm text-muted-foreground">
          アクティブな会員の情報と初回特典の郵送状況を管理します
        </p>
      </div>

      <div className="mb-4">
        <Suspense>
          <PaymentFilter current={currentFilter} />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">読み込み中...</p>
          </div>
        }
      >
        <MembersContent paymentStatus={paymentStatus} />
      </Suspense>
    </div>
  );
}
