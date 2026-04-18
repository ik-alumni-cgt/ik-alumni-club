import { Button } from "@/components/ui/button";
import { getAllBlogs } from "@/data/blog";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import {
  blogsColumns,
  type BlogForTable,
} from "@/components/admin/tables/columns/blogs-columns";

export default async function AdminBlogsPage() {
  const blogs = await getAllBlogs();

  const data: BlogForTable[] = blogs.map((blog) => ({
    id: blog.id,
    title: blog.title,
    thumbnailUrl: blog.thumbnailUrl,
    published: blog.published,
    isMemberOnly: blog.isMemberOnly,
    authorName: blog.authorName,
    createdAt: blog.createdAt.toISOString(),
  }));

  return (
    <div>
      <DataTable
        columns={blogsColumns}
        data={data}
        searchKey="title"
        searchPlaceholder="タイトルで検索..."
        toolbar={
          <Button asChild>
            <Link href="/admin/blogs/new">
              <Plus className="mr-2 h-4 w-4" />
              新規作成
            </Link>
          </Button>
        }
        emptyState={{
          title: "ブログがありません",
          description: "新しいブログ記事を作成してください",
          action: (
            <Button asChild className="mt-2">
              <Link href="/admin/blogs/new">
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
