import { Button } from "@/components/ui/button";
import { getAllBlogs } from "@/data/blog";

import Link from "next/link";
import { ContentDataTable } from "@/components/admin/tables/content-data-table";
import type { ContentForTable } from "@/components/admin/tables/columns/content-columns";

export default async function AdminBlogsPage() {
  const blogs = await getAllBlogs();

  const data: ContentForTable[] = blogs.map((blog) => ({
    id: blog.id,
    title: blog.title,
    published: blog.published,
    isMemberOnly: blog.isMemberOnly,
    updatedAt: blog.updatedAt.toISOString(),
    imageUrl: blog.thumbnailUrl,
  }));

  return (
    <div>
      <ContentDataTable
        data={data}
        editBasePath="/admin/blogs"
        toolbar={
          <Button asChild>
            <Link href="/admin/blogs/new">
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
                新規作成
              </Link>
            </Button>
          ),
        }}
      />
    </div>
  );
}
