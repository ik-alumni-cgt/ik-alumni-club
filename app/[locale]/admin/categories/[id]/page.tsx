import { CategoryForm } from "@/components/admin/category-form";
import { Button } from "@/components/ui/button";
import { getCategory, getParentCategories } from "@/data/category";
import { deleteCategory } from "@/actions/category";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [category, parentCategories] = await Promise.all([
    getCategory(id),
    getParentCategories(),
  ]);

  if (!category) {
    notFound();
  }

  async function handleDelete() {
    "use server";
    await deleteCategory(id);
    revalidatePath("/admin/categories");
    redirect("/admin/categories");
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">カテゴリー編集</h1>
        <p className="text-muted-foreground">カテゴリーを編集します</p>
      </div>

      <div className="mb-6">
        <CategoryForm
          mode="edit"
          defaultValues={{
            id: category.id,
            name: category.name,
            slug: category.slug,
            parentId: category.parentId,
            sortOrder: category.sortOrder,
          }}
          parentCategories={parentCategories}
        />
      </div>

      <div className="border-t pt-6">
        <h2 className="mb-3 text-lg font-semibold text-destructive">
          危険な操作
        </h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              削除
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>本当に削除しますか?</AlertDialogTitle>
              <AlertDialogDescription>
                「{category.name}」を削除します。この操作は取り消せません。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                削除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
