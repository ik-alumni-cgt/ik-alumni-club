"use client";

import { createEditorInvite } from "@/actions/admin/editor-invites/create-editor-invite";
import { deleteEditorInvite } from "@/actions/admin/editor-invites/delete-editor-invite";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type InviteItem = {
  id: string;
  label: string | null;
  url: string;
  expiresAt: string;
  maxUses: number;
  usedCount: number;
  users: { name: string; usedAt: string }[];
};

const DEFAULT_MAX_USES = 30;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP");
}

export function EditorInviteManager({ items }: { items: InviteItem[] }) {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [maxUses, setMaxUses] = useState(String(DEFAULT_MAX_USES));
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    const parsed = Number(maxUses);
    if (!Number.isInteger(parsed) || parsed < 1) {
      toast.error("上限人数は1以上の整数で入力してください");
      return;
    }

    startTransition(async () => {
      try {
        await createEditorInvite({ label, maxUses: parsed });
        setLabel("");
        setMaxUses(String(DEFAULT_MAX_USES));
        toast.success("招待リンクを発行しました");
        router.refresh();
      } catch (error) {
        console.error("招待の発行エラー:", error);
        toast.error("招待の発行に失敗しました");
      }
    });
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("リンクをコピーしました");
    } catch {
      toast.error("コピーに失敗しました");
    }
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteEditorInvite(id);
        toast.success("招待を削除しました");
        router.refresh();
      } catch (error) {
        console.error("招待の削除エラー:", error);
        toast.error("招待の削除に失敗しました");
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="invite-label">メモ（任意）</Label>
            <Input
              id="invite-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="ダンスチーム用"
            />
            <p className="text-sm text-muted-foreground">
              何のための招待かを判別するためのメモです。メンバーには表示されません。
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-max-uses">上限人数</Label>
            <Input
              id="invite-max-uses"
              type="number"
              min={1}
              max={200}
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              className="max-w-32"
            />
            <p className="text-sm text-muted-foreground">
              この人数に達するとリンクは使えなくなります。実際の人数より少し多めが目安です。
            </p>
          </div>
          <Button onClick={handleCreate} disabled={isPending}>
            招待リンクを発行
          </Button>
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          まだ招待はありません。上のボタンから発行してください。
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const isExpired = new Date(item.expiresAt).getTime() < Date.now();
            const isFull = item.usedCount >= item.maxUses;
            const isUsable = !isExpired && !isFull;

            return (
              <Card key={item.id}>
                <CardContent className="space-y-3 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">
                      {item.label || "（メモなし）"}
                    </span>
                    {isExpired ? (
                      <Badge variant="destructive">期限切れ</Badge>
                    ) : isFull ? (
                      <Badge variant="destructive">上限に達しました</Badge>
                    ) : (
                      <Badge variant="secondary">利用できます</Badge>
                    )}
                    <Badge variant="outline">
                      {item.usedCount} / {item.maxUses} 人
                    </Badge>
                  </div>

                  {isUsable && (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input readOnly value={item.url} className="font-mono text-xs" />
                      <Button
                        variant="outline"
                        onClick={() => handleCopy(item.url)}
                        disabled={isPending}
                      >
                        コピー
                      </Button>
                    </div>
                  )}

                  {item.users.length > 0 && (
                    <div className="rounded-md bg-muted p-3">
                      <p className="mb-1 text-sm font-medium">参加した人</p>
                      <ul className="space-y-0.5 text-sm text-muted-foreground">
                        {item.users.map((user) => (
                          <li key={`${user.name}-${user.usedAt}`}>
                            {user.name}（{formatDate(user.usedAt)}）
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      有効期限 {formatDate(item.expiresAt)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDelete(item.id)}
                      disabled={isPending}
                    >
                      削除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
