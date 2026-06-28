import { verifySession } from "@/lib/session";
import { isAdmin } from "@/data/member";
import { redirect } from "next/navigation";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-dashboard/admin-sidebar";
import { AdminHeader } from "@/components/admin-dashboard/admin-header";

// 管理画面は認証必須かつ DB 参照前提のため、配下すべてを動的レンダリングにする。
// （ビルド時の静的生成で DB スキーマに依存して失敗するのを防ぐ）
export const dynamic = "force-dynamic";

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
    <div className="bg-[#fafafa] font-sans">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <AdminHeader />
          <main className="flex-1 p-4">
            <div className="mx-auto max-w-screen-2xl">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
