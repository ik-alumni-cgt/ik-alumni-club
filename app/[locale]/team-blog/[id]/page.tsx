import { BlogForm } from "@/components/blog-form";
import { BlogCard } from "@/components/blog-card";
import { DeleteBlogButton } from "@/components/delete-blog-button";
import { Button } from "@/components/ui/button";
import { getBlog } from "@/data/blog";
import { getCategoriesTree, getBlogCategoryIds } from "@/data/category";
import { verifyTeamMemberOrAdmin } from "@/lib/session";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditTeamBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId, member } = await verifyTeamMemberOrAdmin();

  const [blog, categoriesTree, initialCategoryIds] = await Promise.all([
    getBlog(id),
    getCategoriesTree(),
    getBlogCategoryIds(id),
  ]);

  if (!blog) {
    notFound();
  }

  // team_member は自分の記事のみ編集可能（他人の記事は存在しない扱い）
  if (member.role !== "admin" && blog.authorId !== userId) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/team-blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">ブログ編集</h1>
        <p className="text-muted-foreground">ブログ記事を編集します</p>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">プレビュー</h2>
        <BlogCard blog={blog} isAdmin={true} />
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">編集</h2>
        <BlogForm
          mode="edit"
          defaultValues={{
            id: blog.id,
            title: blog.title,
            excerpt: blog.excerpt,
            content: blog.content,
            thumbnailUrl: blog.thumbnailUrl || "",
            publishedAt: blog.publishedAt
              ? blog.publishedAt.toISOString().split("T")[0]
              : "",
            published: blog.published,
            isMemberOnly: blog.isMemberOnly,
          }}
          categoriesTree={categoriesTree}
          initialCategoryIds={initialCategoryIds}
          redirectPath="/team-blog"
        />
      </div>

      <div className="border-t pt-6">
        <h2 className="mb-3 text-lg font-semibold text-destructive">
          危険な操作
        </h2>
        <DeleteBlogButton
          blogId={blog.id}
          blogTitle={blog.title}
          redirectPath="/team-blog"
        />
      </div>
    </div>
  );
}
