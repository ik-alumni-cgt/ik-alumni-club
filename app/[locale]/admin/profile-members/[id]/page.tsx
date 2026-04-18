import { ProfileMemberForm } from "@/components/admin/profile-member-form"
import { DeleteProfileMemberButton } from "@/components/admin/delete-profile-member-button"
import { Button } from "@/components/ui/button"
import { getProfileMember } from "@/data/profile-member"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default async function EditProfileMemberPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const member = await getProfileMember(id)

  if (!member) {
    notFound()
  }

  return (
    <div className="container max-w-3xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/profile-members">
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">メンバー編集</h1>
        <p className="text-muted-foreground">プロフィールメンバーの情報を編集します</p>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">プレビュー</h2>
        <div className="rounded-xl border bg-card overflow-hidden max-w-xs">
          {member.imageUrl ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
              <Image
                src={member.imageUrl}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center bg-muted">
              <span className="text-muted-foreground text-sm">画像なし</span>
            </div>
          )}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg">{member.name}</h3>
              {member.isVisible ? (
                <Badge variant="default" className="text-xs">公開</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">非公開</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{member.description}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">編集</h2>
        <ProfileMemberForm
          mode="edit"
          defaultValues={{
            id: member.id,
            name: member.name,
            description: member.description,
            imageUrl: member.imageUrl || "",
            sortOrder: member.sortOrder,
            isVisible: member.isVisible,
            memberId: member.memberId,
          }}
        />
      </div>

      <div className="border-t pt-6">
        <h2 className="mb-3 text-lg font-semibold text-destructive">
          危険な操作
        </h2>
        <DeleteProfileMemberButton
          memberId={member.id}
          memberName={member.name}
        />
      </div>
    </div>
  )
}
