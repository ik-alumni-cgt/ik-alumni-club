"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryFormSchema, type CategoryFormData } from "@/zod/category";
import { createCategory, updateCategory } from "@/actions/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Category } from "@/types/category";

type Props = {
  defaultValues?: CategoryFormData & { id?: string };
  mode: "create" | "edit";
  parentCategories: Category[];
};

export function CategoryForm({ defaultValues, mode, parentCategories }: Props) {
  const router = useRouter();
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: defaultValues || {
      name: "",
      slug: "",
      parentId: null,
      color: "#3B82F6",
      sortOrder: 0,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (mode === "create") {
        await createCategory(data);
        toast.success("カテゴリーを作成しました");
      } else if (defaultValues?.id) {
        await updateCategory(defaultValues.id, data);
        toast.success("カテゴリーを更新しました");
      }
      router.push("/admin/categories");
      router.refresh();
    } catch {
      toast.error("エラーが発生しました");
    }
  };

  // カテゴリー名からスラッグを自動生成
  const handleNameChange = (name: string, onChange: (v: string) => void) => {
    onChange(name);
    // スラッグが空の場合のみ自動生成
    const currentSlug = form.getValues("slug");
    if (!currentSlug || currentSlug === "") {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]+/g, "-")
        .replace(/^-|-$/g, "");
      form.setValue("slug", slug);
    }
  };

  // 編集時、自分自身を親カテゴリー候補から除外
  const filteredParentCategories = parentCategories.filter(
    (c) => c.id !== defaultValues?.id,
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>カテゴリー名 *</FormLabel>
              <FormControl>
                <Input
                  placeholder="カテゴリー名を入力"
                  {...field}
                  onChange={(e) =>
                    handleNameChange(e.target.value, field.onChange)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>スラッグ *</FormLabel>
              <FormControl>
                <Input placeholder="category-slug" {...field} />
              </FormControl>
              <FormDescription>
                URLに使用される識別子です（半角英数字とハイフンのみ）
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>親カテゴリー</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange(value === "none" ? null : value)
                }
                defaultValue={field.value || "none"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="親カテゴリーを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">
                    なし（親カテゴリーとして作成）
                  </SelectItem>
                  {filteredParentCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>色</FormLabel>
              <FormControl>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    className="h-10 w-16 p-1"
                    value={field.value ?? "#3B82F6"}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <Input
                    placeholder="#3B82F6"
                    className="w-40"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </div>
              </FormControl>
              <FormDescription>
                一覧のカテゴリーバッジに使う色です（#RRGGBB 形式）
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sortOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>表示順</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                数値が小さいほど先に表示されます
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "保存中..."
              : mode === "create"
                ? "作成"
                : "更新"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
