import { BlogForm } from "@/components/blog-form";
import { Button } from "@/components/ui/button";
import { getCategoriesTree } from "@/data/category";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewBlogPage() {
  const categoriesTree = await getCategoriesTree();

  return (
    <div className="container max-w-3xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/blogs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">ブログ作成</h1>
        <p className="text-muted-foreground">新しいブログ記事を作成します</p>
      </div>

      <BlogForm mode="create" categoriesTree={categoriesTree} />
    </div>
  );
}
