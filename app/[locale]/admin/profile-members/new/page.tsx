import { ProfileMemberForm } from "@/components/admin/profile-member-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewProfileMemberPage() {
  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/profile-members">
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">メンバー追加</h1>
        <p className="text-muted-foreground">プロフィールページに表示するメンバーを追加します</p>
      </div>

      <ProfileMemberForm mode="create" />
    </div>
  )
}
