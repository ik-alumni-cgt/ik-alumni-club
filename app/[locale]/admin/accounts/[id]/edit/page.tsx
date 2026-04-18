import { Button } from "@/components/ui/button";
import { getAccountById } from "@/data/account";
import { getAllMemberPlans } from "@/data/member-plan";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AccountForm } from "@/components/account-form";
import { MemberPlan } from "@/types/member-plan";

export default async function EditAccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [account, memberPlansRaw] = await Promise.all([
    getAccountById(id),
    getAllMemberPlans(),
  ]);

  if (!account) {
    notFound();
  }

  // 型変換: features を string[] | null に変換
  const memberPlans: MemberPlan[] = memberPlansRaw.map((plan) => ({
    ...plan,
    features: plan.features as string[] | null,
  }));

  // account.plan も型変換
  const accountWithTypedPlan = {
    ...account,
    plan: account.plan ? {
      ...account.plan,
      features: account.plan.features as string[] | null,
    } : null,
  };

  return (
    <div className="container max-w-3xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href={`/admin/accounts/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            詳細に戻る
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">会員編集</h1>
        <p className="text-muted-foreground">会員情報を編集します</p>
      </div>

      <AccountForm account={accountWithTypedPlan} memberPlans={memberPlans} />
    </div>
  );
}
