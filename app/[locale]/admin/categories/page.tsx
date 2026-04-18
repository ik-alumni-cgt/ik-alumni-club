import { CategoryTree } from "@/components/admin/category-tree";
import { Button } from "@/components/ui/button";
import { getCategoriesTree } from "@/data/category";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesTree();

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">
              カテゴリーがありません
            </h3>
            <p className="text-sm text-muted-foreground">
              新しいカテゴリーを作成してください
            </p>
            <Button asChild className="mt-4">
              <Link href="/admin/categories/new">
                <Plus className="mr-2 h-4 w-4" />
                新規作成
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <CategoryTree categories={categories} />
      )}
    </div>
  );
}
