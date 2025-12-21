"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { deleteSponsor } from "@/actions/sponsor"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Trash2, Eye, CheckCircle, XCircle, Flag } from "lucide-react"
import Link from "next/link"
import type { Sponsor } from "@/types/sponsor"
import Image from "next/image"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

interface SponsorCardProps {
  sponsor: Sponsor
}

export function SponsorCard({ sponsor }: SponsorCardProps) {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await deleteSponsor(sponsor.id)
      toast.success("スポンサー回答を削除しました")
      router.refresh()
    } catch (error) {
      toast.error("削除に失敗しました")
      console.error(error)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {sponsor.logoUrl && (
              <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                <Image
                  src={sponsor.logoUrl}
                  alt={`${sponsor.companyName}のロゴ`}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{sponsor.companyName}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {sponsor.representativeName}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant={sponsor.hasFlag ? "default" : "secondary"}>
            <Flag className="mr-1 h-3 w-3" />
            フラッグ: {sponsor.hasFlag ? "希望あり" : "希望なし"}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            {sponsor.programConsent ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-muted-foreground" />
            )}
            <span>プログラム掲載</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {sponsor.websiteConsent ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-muted-foreground" />
            )}
            <span>HP掲載</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          回答日: {format(new Date(sponsor.createdAt), "yyyy年M月d日 HH:mm", { locale: ja })}
        </p>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href={`/admin/sponsors/${sponsor.id}`}>
              <Eye className="mr-1 h-4 w-4" />
              詳細
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                <AlertDialogDescription>
                  「{sponsor.companyName}」の回答を削除します。この操作は取り消せません。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  削除
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
