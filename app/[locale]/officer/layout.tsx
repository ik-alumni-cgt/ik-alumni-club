import { verifySession } from "@/lib/session";
import { isOfficerOrAdmin } from "@/data/member";
import { redirect } from "next/navigation";

export default async function OfficerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await verifySession();

  const hasAccess = await isOfficerOrAdmin();
  if (!hasAccess) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white px-4 py-3 shadow-sm sm:px-6">
        <h1 className="text-lg font-semibold sm:text-xl">役員メニュー</h1>
      </header>
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
