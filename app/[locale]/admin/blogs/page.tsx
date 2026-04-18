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
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ブログ管理</h1>
          <p className="text-muted-foreground">
            ブログ記事の作成・編集・削除ができます
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </div>

      <DataTable
        columns={blogsColumns}
        data={data}
        searchKey="title"
        searchPlaceholder="タイトルで検索..."
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
