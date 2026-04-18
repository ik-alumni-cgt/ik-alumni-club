export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { getAllProfileMembers } from "@/data/profile-member";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import {
  profileMembersColumns,
  type ProfileMemberForTable,
} from "@/components/admin/tables/columns/profile-members-columns";

export default async function AdminProfileMembersPage() {
  const members = await getAllProfileMembers();

  const data: ProfileMemberForTable[] = members.map((member) => ({
    id: member.id,
    name: member.name,
    description: member.description,
    imageUrl: member.imageUrl,
    sortOrder: member.sortOrder,
    isVisible: member.isVisible,
  }));

  return (
    <div>
      <DataTable
        columns={profileMembersColumns}
        data={data}
        searchKey="name"
        searchPlaceholder="名前で検索..."
        toolbar={
          <Button asChild>
            <Link href="/admin/profile-members/new">
              <Plus className="mr-2 h-4 w-4" />
              新規追加
            </Link>
          </Button>
        }
        emptyState={{
          title: "メンバーがいません",
          description: "新しいメンバーを追加してください",
          action: (
            <Button asChild className="mt-2">
              <Link href="/admin/profile-members/new">
                <Plus className="mr-2 h-4 w-4" />
                新規追加
              </Link>
            </Button>
          ),
        }}
      />
    </div>
  );
}
