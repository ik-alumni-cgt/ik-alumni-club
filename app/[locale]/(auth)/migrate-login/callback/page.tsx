import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, accounts } from "@/db/schemas/auth";
import { members } from "@/db/schemas/member";
import { eq, and } from "drizzle-orm";

export default async function MigrateLoginCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email: targetEmail } = await searchParams;

  // セッションからユーザー情報を取得
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    // セッションがない場合は移行ログインページへ
    redirect("/migrate-login");
  }

  // targetEmailが指定されている場合、移行ユーザーへのリンク処理
  if (targetEmail) {
    const currentUserEmail = session.user.email;

    // 現在のユーザーがLINEのダミーメールでログインしている場合
    if (currentUserEmail.endsWith("@line.me")) {
      // 移行ユーザーを検索
      const targetUser = await db.query.users.findFirst({
        where: eq(users.email, targetEmail.toLowerCase()),
      });

      if (targetUser) {
        // 移行ユーザーかどうか確認
        const member = await db.query.members.findFirst({
          where: and(
            eq(members.userId, targetUser.id),
            eq(members.isMigrated, true)
          ),
        });

        if (member) {
          // LINEアカウントを移行ユーザーに紐付け
          await db
            .update(accounts)
            .set({ userId: targetUser.id, updatedAt: new Date() })
            .where(
              and(
                eq(accounts.userId, session.user.id),
                eq(accounts.providerId, "line")
              )
            );

          // 不要なLINEダミーユーザーを削除
          const otherAccounts = await db.query.accounts.findFirst({
            where: eq(accounts.userId, session.user.id),
          });

          if (!otherAccounts) {
            await db.delete(users).where(eq(users.id, session.user.id));
          }

          // セッションを無効化して再ログインを促す
          // （新しいユーザーIDでセッションを取得するため）
          redirect("/migrate-login?linked=true&email=" + encodeURIComponent(targetEmail));
        }
      }
    }
  }

  // 通常のログイン成功 → マイページへ
  redirect("/mypage");
}
