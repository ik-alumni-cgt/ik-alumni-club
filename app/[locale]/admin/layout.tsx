import { verifySession } from "@/lib/session";
import { isAdmin } from "@/data/member";
import { redirect } from "next/navigation";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-dashboard/admin-sidebar";
import { AdminHeader } from "@/components/admin-dashboard/admin-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // セッション確認
  await verifySession();

  // 管理者権限チェック
  const adminCheck = await isAdmin();

  if (!adminCheck) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <main className="flex-1 bg-gray-50/50 p-4 md:p-6">
          <div className="mx-auto max-w-screen-2xl">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
