import { verifyTeamMemberOrAdmin } from "@/lib/session";
import Link from "next/link";

// 認証必須かつ DB 参照前提のため、配下すべてを動的レンダリングにする
export const dynamic = "force-dynamic";

export default async function TeamBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // team_member（承認済み）または admin のみアクセス可能
  // 承認待ち（pending_approval）は /team-login/pending へリダイレクトされる
  await verifyTeamMemberOrAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white px-4 py-3 shadow-sm sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/team-blog" className="text-lg font-semibold sm:text-xl">
            メンバーブログ
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl p-4 sm:p-6">{children}</main>
    </div>
  );
}
