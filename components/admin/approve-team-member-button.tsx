"use client";

import { approveTeamMember } from "@/actions/admin/accounts/approve-team-member";
import { Button } from "@/components/ui/button";
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
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

export function ApproveTeamMemberButton({
  accountId,
  accountName,
}: {
  accountId: string;
  accountName: string;
}) {
  const router = useRouter();

  const handleApprove = async () => {
    try {
      await approveTeamMember(accountId);
      toast.success("承認しました", {
        description: `${accountName}をチームメンバーとして有効化しました。`,
      });
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: "承認に失敗しました",
      });
      console.error(error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Check className="mr-2 h-4 w-4" />
          承認する
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>チームメンバーを承認しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            「{accountName}」をチームメンバーとして有効化します。
            <br />
            承認後、本人はメンバーブログの執筆と会員コンテンツの閲覧ができるようになります。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={handleApprove}>承認</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
