import { Button } from "@/components/ui/button";
import { getBlogsByAuthor } from "@/data/blog";
import { verifyEditor } from "@/lib/session";
import Link from "next/link";
import { ContentDataTable } from "@/components/admin/tables/content-data-table";
import type { ContentForTable } from "@/components/admin/tables/columns/content-columns";

// セッションに応じてガードが働くため、ページ単位でも動的レンダリングを強制する
// （レイアウトの force-dynamic だけではページがプリレンダリングされる）
export const dynamic = "force-dynamic";

export default async function TeamBlogListPage() {
  // ログイン中の編集者 / admin 本人の記事のみ表示
  const { userId } = await verifyEditor();
  const blogs = await getBlogsByAuthor(userId);

  const data: ContentForTable[] = blogs.map((blog) => ({
    id: blog.id,
    title: blog.title,
    published: blog.published,
    isMemberOnly: blog.isMemberOnly,
    updatedAt: blog.updatedAt.toISOString(),
    imageUrl: blog.thumbnailUrl,
    categories: blog.blogCategories.map((bc) => ({
      id: bc.category.id,
      name: bc.category.name,
    })),
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">自分の記事</h1>
        <p className="text-muted-foreground">
          あなたが投稿したブログ記事の一覧です
        </p>
      </div>
      <ContentDataTable
        data={data}
        editBasePath="/team-blog"
        toolbar={
          <Button asChild>
            <Link href="/team-blog/new">新規作成</Link>
          </Button>
        }
        emptyState={{
          title: "まだ記事がありません",
          description: "新しいブログ記事を作成してください",
          action: (
            <Button asChild className="mt-2">
              <Link href="/team-blog/new">新規作成</Link>
            </Button>
          ),
        }}
      />
    </div>
  );
}
