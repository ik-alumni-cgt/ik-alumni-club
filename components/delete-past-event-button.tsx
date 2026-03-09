"use client";

import { deletePastEvent } from "@/actions/past-event";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function DeletePastEventButton({
  pastEventId,
  pastEventTitle,
}: {
  pastEventId: string;
  pastEventTitle: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deletePastEvent(pastEventId);
      toast.success("過去のイベントを削除しました", {
        description: `${pastEventTitle}を削除しました`,
      });
      router.push("/admin/past-events");
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: "過去のイベントの削除に失敗しました",
      });
      console.error(error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          削除
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            「{pastEventTitle}」を削除します。この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>削除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
