import { Button } from "@/components/ui/button";
import { getAllNewsletters } from "@/data/newsletter";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ContentDataTable } from "@/components/admin/tables/content-data-table";
import type { ContentForTable } from "@/components/admin/tables/columns/content-columns";

export default async function AdminNewslettersPage() {
  const newsletters = await getAllNewsletters();

  const data: ContentForTable[] = newsletters.map((newsletter) => ({
    id: newsletter.id,
    title: newsletter.title,
    published: newsletter.published,
    isMemberOnly: newsletter.isMemberOnly,
    updatedAt: newsletter.updatedAt.toISOString(),
  }));

  return (
    <div>
      <ContentDataTable
        data={data}
        editBasePath="/admin/newsletters"
        toolbar={
          <Button asChild>
            <Link href="/admin/newsletters/new">
              <Plus className="mr-2 h-4 w-4" />
              新規作成
            </Link>
          </Button>
        }
        emptyState={{
          title: "Digital Magazineがありません",
          description: "新しいDigital Magazineを作成してください",
          action: (
            <Button asChild className="mt-2">
              <Link href="/admin/newsletters/new">
                <Plus className="mr-2 h-4 w-4" />
                新規作成
              </Link>
            </Button>
          ),
        }}
      />
    </div>
  );
}
