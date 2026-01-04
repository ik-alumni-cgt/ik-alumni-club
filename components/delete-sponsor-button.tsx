"use client"

import { deleteSponsor } from "@/actions/sponsor"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
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
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

export function DeleteSponsorButton({
  sponsorId,
  companyName,
}: {
  sponsorId: string
  companyName: string | null
}) {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await deleteSponsor(sponsorId)
      toast.success("スポンサー回答を削除しました", {
        description: `${companyName ?? "個人会員"}の回答を削除しました`,
      })
      router.push("/admin/sponsors")
      router.refresh()
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: "削除に失敗しました",
      })
      console.error(error)
    }
  }

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
            「{companyName ?? "個人会員"}」の回答を削除します。この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>削除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
