export const dynamic = "force-dynamic"

import { Button } from "@/components/ui/button"
import { getAllProfileMembers } from "@/data/profile-member"
import { Plus, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export default async function AdminProfileMembersPage() {
  const members = await getAllProfileMembers()

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">プロフィールメンバー管理</h1>
          <p className="text-muted-foreground">
            プロフィールページに表示するメンバーの管理ができます
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/profile-members/new">
            <Plus className="mr-2 h-4 w-4" />
            新規追加
          </Link>
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">メンバーがいません</h3>
            <p className="text-sm text-muted-foreground">
              新しいメンバーを追加してください
            </p>
            <Button asChild className="mt-4">
              <Link href="/admin/profile-members/new">
                <Plus className="mr-2 h-4 w-4" />
                新規追加
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Link
              key={member.id}
              href={`/admin/profile-members/${member.id}`}
              className="group block"
            >
              <div className="rounded-xl border bg-card overflow-hidden transition-shadow hover:shadow-md">
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
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {member.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <ArrowUpDown className="mr-1 h-3 w-3" />
                        {member.sortOrder}
                      </Badge>
                      {member.isVisible ? (
                        <Badge variant="default" className="text-xs">公開</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">非公開</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {member.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
