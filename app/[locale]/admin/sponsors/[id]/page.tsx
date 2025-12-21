import { Button } from "@/components/ui/button"
import { getSponsor } from "@/data/sponsor"
import { ArrowLeft, CheckCircle, XCircle, Flag } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { DeleteSponsorButton } from "@/components/delete-sponsor-button"

export default async function SponsorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const sponsor = await getSponsor(id)

  if (!sponsor) {
    notFound()
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/sponsors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">スポンサー回答詳細</h1>
          <p className="text-muted-foreground">スポンサーからの回答内容を確認できます</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>会社情報</CardTitle>
            <CardDescription>スポンサー企業の基本情報です</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sponsor.logoUrl && (
              <div className="flex justify-center">
                <div className="relative h-32 w-32 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={sponsor.logoUrl}
                    alt={`${sponsor.companyName}のロゴ`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                会社名
              </div>
              <div className="col-span-2 text-sm font-semibold">
                {sponsor.companyName}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                代表者名
              </div>
              <div className="col-span-2 text-sm">
                {sponsor.representativeName}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>回答内容</CardTitle>
            <CardDescription>フォームからの回答内容です</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                フラッグ希望
              </div>
              <div className="col-span-2">
                <Badge variant={sponsor.hasFlag ? "default" : "secondary"}>
                  <Flag className="mr-1 h-3 w-3" />
                  {sponsor.hasFlag ? "希望あり" : "希望なし"}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                プログラム掲載同意
              </div>
              <div className="col-span-2 flex items-center gap-2">
                {sponsor.programConsent ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">同意する</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">同意しない</span>
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                HP掲載同意
              </div>
              <div className="col-span-2 flex items-center gap-2">
                {sponsor.websiteConsent ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">同意する</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">同意しない</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>回答日時</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                回答日時
              </div>
              <div className="col-span-2 text-sm">
                {format(new Date(sponsor.createdAt), "yyyy年M月d日 HH:mm:ss", { locale: ja })}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                ID
              </div>
              <div className="col-span-2 text-sm text-muted-foreground">
                {sponsor.id}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">危険な操作</CardTitle>
            <CardDescription>
              この操作は取り消すことができません
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeleteSponsorButton
              sponsorId={sponsor.id}
              companyName={sponsor.companyName}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
