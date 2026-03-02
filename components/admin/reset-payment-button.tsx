"use client";

import { resetPayment } from "@/actions/admin/accounts/reset-payment";
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
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export function ResetPaymentButton({
  accountId,
  accountName,
}: {
  accountId: string;
  accountName: string;
}) {
  const router = useRouter();

  const handleReset = async () => {
    try {
      await resetPayment(accountId);
      toast.success("支払い情報をリセットしました", {
        description: `${accountName}の支払い情報をリセットしました。ユーザーに再度手続きを依頼してください。`,
      });
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: "支払い情報のリセットに失敗しました",
      });
      console.error(error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          支払いリセット
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>支払い情報をリセットしますか？</AlertDialogTitle>
          <AlertDialogDescription>
            「{accountName}」の支払い情報をリセットします。
            <br />
            支払いステータスが「未払い」に戻り、Stripeのサブスクリプション情報もクリアされます。
            <br />
            ユーザーが再度 /subscribe から手続きできるようになります。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset}>リセット</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
