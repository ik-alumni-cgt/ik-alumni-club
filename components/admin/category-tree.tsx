"use client";

import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/actions/category";
import type { CategoryWithChildren } from "@/types/category";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

type Props = {
  categories: CategoryWithChildren[];
};

export function CategoryTree({ categories }: Props) {
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteCategory(id);
      toast.success(`「${name}」を削除しました`);
      router.refresh();
    } catch {
      toast.error("削除に失敗しました");
    }
  };

  return (
    <div className="space-y-4">
      {categories.map((parent) => (
        <div key={parent.id} className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{parent.name}</span>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/categories/${parent.id}`}>
                  <Pencil className="mr-1 h-3 w-3" />
                  編集
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="mr-1 h-3 w-3" />
                    削除
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>本当に削除しますか?</AlertDialogTitle>
                    <AlertDialogDescription>
                      「{parent.name}」を削除します。
                      {parent.children.length > 0 &&
                        "子カテゴリーは親なしになります。"}
                      この操作は取り消せません。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(parent.id, parent.name)}
                    >
                      削除
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {parent.children.length > 0 && (
            <div className="mt-3 ml-6 space-y-2">
              {parent.children.map((child, index) => (
                <div
                  key={child.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-muted-foreground">
                    {index === parent.children.length - 1 ? "└─" : "├─"}{" "}
                    {child.name}
                  </span>
                  <div className="flex gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/categories/${child.id}`}>
                        <Pencil className="h-3 w-3" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            本当に削除しますか?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            「{child.name}」を削除します。この操作は取り消せません。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>キャンセル</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(child.id, child.name)}
                          >
                            削除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
