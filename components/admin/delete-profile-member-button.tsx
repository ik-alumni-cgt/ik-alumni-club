"use client"

import { deleteProfileMember } from "@/actions/admin/profile-member"
import { Button } from "@/components/ui/button"
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
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

export function DeleteProfileMemberButton({
  memberId,
  memberName,
}: {
  memberId: string
  memberName: string
}) {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await deleteProfileMember(memberId)
      toast.success("メンバーを削除しました", {
        description: `${memberName}を削除しました`,
      })
      router.push("/admin/profile-members")
      router.refresh()
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: "メンバーの削除に失敗しました",
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
            「{memberName}」を削除します。この操作は取り消せません。
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
