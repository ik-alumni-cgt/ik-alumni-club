import { setLocale } from "@/app/web/i18n/set-locale";
import { EditorInviteManager } from "@/components/admin/editor-invite-manager";
import { getEditorInvites } from "@/data/editor-invite";
import { getBaseURL } from "@/lib/get-base-url";

export const dynamic = "force-dynamic";

export default async function EditorInvitesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  const invites = await getEditorInvites();
  const baseUrl = getBaseURL();

  const items = invites.map((invite) => ({
    id: invite.id,
    label: invite.label,
    url: `${baseUrl}/team-invite/${invite.token}`,
    expiresAt: invite.expiresAt.toISOString(),
    maxUses: invite.maxUses,
    usedCount: invite.usedCount,
    users: invite.uses.map((use) => ({
      name: use.user?.name ?? "（不明）",
      usedAt: use.usedAt.toISOString(),
    })),
  }));

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">編集者の招待</h1>
        <p className="text-muted-foreground">
          招待リンクを 1 本発行して、LINE や Band のグループに共有してください。
          リンクを開いて LINE ログインすると、そのままブログを書けるようになります。
          上限人数に達するか有効期限を過ぎると、そのリンクは使えなくなります。
        </p>
      </div>
      <EditorInviteManager items={items} />
    </div>
  );
}
