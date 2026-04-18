import { Button } from "@/components/ui/button";
import { getAllNewsletters } from "@/data/newsletter";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import {
  newslettersColumns,
  type NewsletterForTable,
} from "@/components/admin/tables/columns/newsletters-columns";

export default async function AdminNewslettersPage() {
  const newsletters = await getAllNewsletters();

  const data: NewsletterForTable[] = newsletters.map((newsletter) => ({
    id: newsletter.id,
    issueNumber: newsletter.issueNumber,
    title: newsletter.title,
    published: newsletter.published,
    isMemberOnly: newsletter.isMemberOnly,
    category: newsletter.category,
    publishedAt: newsletter.publishedAt?.toISOString() ?? null,
    authorName: newsletter.authorName,
    pdfUrl: newsletter.pdfUrl,
  }));

  return (
    <div>
      <DataTable
        columns={newslettersColumns}
        data={data}
        searchKey="title"
        searchPlaceholder="タイトルで検索..."
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
