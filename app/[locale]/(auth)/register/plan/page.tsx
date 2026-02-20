import { redirect } from "next/navigation";
import { setLocale } from "@/app/web/i18n/set-locale";
import { PlanSelectionForm } from "@/components/register/plan-selection-form";
import { getMemberPlans } from "@/actions/member-plans/get-member-plans";
import type { MemberPlan } from "@/types/member-plan";

const isRegistrationOpen = process.env.NEXT_PUBLIC_REGISTRATION_OPEN === "true";

export default async function PlanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  if (!isRegistrationOpen) {
    redirect("/register/terms");
  }

  const result = await getMemberPlans();
  // stripePriceIdが設定されているプランのみを表示
  const plans: MemberPlan[] = result.success && result.data
    ? result.data.filter(plan => plan.stripePriceId)
    : [];

  return (
    <div className="w-full max-w-6xl">
      <PlanSelectionForm plans={plans} />
    </div>
  );
}
