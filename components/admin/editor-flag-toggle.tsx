"use client";

import { updateEditorFlag } from "@/actions/admin/accounts/update-editor-flag";
import { Switch } from "@/components/ui/switch";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  accountId: string;
  isEditor: boolean;
};

export function EditorFlagToggle({ accountId, isEditor }: Props) {
  const router = useRouter();
  const [checked, setChecked] = useState(isEditor);
  const [isPending, startTransition] = useTransition();

  const handleChange = (next: boolean) => {
    const previous = checked;
    setChecked(next);

    startTransition(async () => {
      try {
        await updateEditorFlag(accountId, next);
        toast.success(next ? "編集者に設定しました" : "編集者を解除しました");
        router.refresh();
      } catch (error) {
        console.error("編集者フラグの更新エラー:", error);
        setChecked(previous);
        toast.error("編集者の設定に失敗しました");
      }
    });
  };

  return (
    <Switch
      checked={checked}
      onCheckedChange={handleChange}
      disabled={isPending}
      aria-label="編集者"
    />
  );
}
