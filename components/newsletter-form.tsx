"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterFormSchema, type NewsletterFormData } from "@/zod/newsletter";
import { createNewsletter, updateNewsletter } from "@/actions/newsletter";
import { updateNewsletterCategories } from "@/actions/category";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputImage } from "@/components/input-image";
import { InputFile } from "@/components/input-file";
import { CategorySelect } from "@/components/admin/category-select";
import type { CategoryWithChildren } from "@/types/category";

interface NewsletterFormProps {
  defaultValues?: NewsletterFormData & { id?: string };
  mode: "create" | "edit";
  nextIssueNumber?: number;
  categoriesTree?: CategoryWithChildren[];
  initialCategoryIds?: string[];
}

export function NewsletterForm({
  defaultValues,
  mode,
  nextIssueNumber,
  categoriesTree = [],
  initialCategoryIds = [],
}: NewsletterFormProps) {
  const router = useRouter();
  const [categoryIds, setCategoryIds] = useState<string[]>(initialCategoryIds);
  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: defaultValues
      ? {
          issueNumber: Number(defaultValues.issueNumber),
          title: defaultValues.title,
          excerpt: defaultValues.excerpt,
          content: defaultValues.content,
          thumbnailUrl: defaultValues.thumbnailUrl ?? "",
          pdfUrl: defaultValues.pdfUrl ?? "",
          category: defaultValues.category,
          publishedAt: defaultValues.publishedAt
            ? typeof defaultValues.publishedAt === "string"
              ? defaultValues.publishedAt
              : new Date(defaultValues.publishedAt as unknown as string).toISOString().split("T")[0]
            : "",
          published: defaultValues.published,
          isMemberOnly: defaultValues.isMemberOnly ?? true,
        }
      : {
          issueNumber: nextIssueNumber || 1,
          title: "",
          excerpt: "",
          content: "",
          thumbnailUrl: "",
          pdfUrl: "",
          category: "regular",
          publishedAt: "",
          published: false,
          isMemberOnly: true,
        },
  });

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      if (mode === "create") {
        const created = await createNewsletter(data);
        if (created) {
          await updateNewsletterCategories(created.id, categoryIds);
        }
        toast.success("Digital Magazineを作成しました", {
          description: `第${data.issueNumber}号を作成しました`,
        });
      } else if (defaultValues?.id) {
        await updateNewsletter(defaultValues.id, data);
        await updateNewsletterCategories(defaultValues.id, categoryIds);
        toast.success("Digital Magazineを更新しました", {
          description: `第${data.issueNumber}号を更新しました`,
        });
      }
      router.push("/admin/newsletters");
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: `Digital Magazineの${mode === "create" ? "作成" : "更新"}に失敗しました`,
      });
      console.error(error);
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 号数 */}
        <FormField
          control={form.control}
          name="issueNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>号数 *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="1"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  disabled={mode === "edit"}
                />
              </FormControl>
              <FormDescription>
                {mode === "edit"
                  ? "号数は変更できません"
                  : "次の号数が自動的に設定されます"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* タイトル */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>タイトル *</FormLabel>
              <FormControl>
                <Input placeholder="第1号 2025年春号" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 概要 */}
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>概要 *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="今号の見どころを簡潔に..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                一覧ページで表示される概要です（500文字以内）
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 本文 */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>本文 *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digital Magazineの本文をHTML形式で入力..."
                  rows={15}
                  className="font-mono"
                  {...field}
                />
              </FormControl>
              <FormDescription>HTMLタグを使用できます</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* サムネイル画像 */}
        <FormField
          control={form.control}
          name="thumbnailUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>サムネイル画像</FormLabel>
              <FormControl>
                <InputImage
                  width={400}
                  aspectRatio={16 / 9}
                  resultWidth={800}
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                画像をドラッグ&ドロップまたはクリックして選択してください
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PDF版 */}
        <FormField
          control={form.control}
          name="pdfUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PDF版</FormLabel>
              <FormControl>
                <InputFile
                  value={field.value || ""}
                  onChange={field.onChange}
                  accept="application/pdf"
                  maxSize={1024 * 1024 * 20} // 20MB
                  placeholder="PDFファイルを選択してください"
                />
              </FormControl>
              <FormDescription>
                PDF版の会報ファイルをアップロードしてください（最大20MB）
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* カテゴリ */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>カテゴリ</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="regular">定期号</SelectItem>
                  <SelectItem value="special">特別号</SelectItem>
                  <SelectItem value="extra">号外</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 公開日 */}
        <FormField
          control={form.control}
          name="publishedAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>公開日</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>
                コンテンツの公開日を設定してください
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* カテゴリー */}
        <FormItem>
          <FormLabel>カテゴリー</FormLabel>
          <FormControl>
            <CategorySelect
              categoriesTree={categoriesTree}
              selectedIds={categoryIds}
              onChange={setCategoryIds}
            />
          </FormControl>
          <FormDescription>
            コンテンツに関連するカテゴリーを選択してください
          </FormDescription>
        </FormItem>

        {/* 公開状態 */}
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">公開する</FormLabel>
                <FormDescription>ONにすると会員に公開されます</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 会員限定フラグ */}
        <FormField
          control={form.control}
          name="isMemberOnly"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">会員限定</FormLabel>
                <FormDescription>ONにすると会員のみ閲覧可能になります</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "処理中..."
              : mode === "create"
              ? "作成"
              : "更新"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
