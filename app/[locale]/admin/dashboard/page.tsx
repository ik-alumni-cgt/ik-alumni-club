import { verifySession } from "@/lib/session";
import { setLocale } from "@/app/web/i18n/set-locale";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard/admin-dashboard";
import { isAdmin } from "@/data/member";
import { getDashboardStats } from "@/data/dashboard";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const session = await verifySession();

  const adminCheck = await isAdmin();

  if (!adminCheck) {
    redirect("/");
  }

  const stats = await getDashboardStats();

  return <AdminDashboard stats={stats} userName={session.user.name} />;
}
