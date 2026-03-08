"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { informationFormSchema } from "@/zod/information";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { createInformation, updateInformation } from "@/actions/information";
import { updateInformationCategories } from "@/actions/category";
import { toast } from "sonner";
import { Information, InformationFormData } from "@/types/information";
import { InputImage } from "@/components/input-image";
import { CategorySelect } from "@/components/admin/category-select";
import type { CategoryWithChildren } from "@/types/category";

export function InformationForm({
  defaultValues,
  categoriesTree = [],
  initialCategoryIds = [],
}: {
  defaultValues?: Information;
  categoriesTree?: CategoryWithChildren[];
  initialCategoryIds?: string[];
}) {
  const router = useRouter();
  const [categoryIds, setCategoryIds] = useState<string[]>(initialCategoryIds);
  const form = useForm<InformationFormData>({
    resolver: zodResolver(informationFormSchema),
    defaultValues: defaultValues
      ? {
          date: defaultValues.date,
          title: defaultValues.title,
          content: defaultValues.content,
          imageUrl: defaultValues.imageUrl ?? "",
          url: defaultValues.url ?? "",
          published: defaultValues.published,
          isMemberOnly: defaultValues.isMemberOnly,
        }
      : {
          date: new Date().toISOString().split("T")[0], // 今日の日付をデフォルト
          title: "",
          content: "",
          imageUrl: "",
          url: "",
          published: false,
          isMemberOnly: false,
        },
  });

  async function onSubmit(data: InformationFormData) {
    try {
      if (defaultValues) {
        await updateInformation(defaultValues.id, data);
        await updateInformationCategories(defaultValues.id, categoryIds);
        toast.success("お知らせを更新しました", {
          description: `${data.title}を更新しました`,
        });
      } else {
        const created = await createInformation(data);
        if (created) {
          await updateInformationCategories(created.id, categoryIds);
        }
        toast.success("お知らせを作成しました", {
          description: `${data.title}を作成しました`,
        });
      }
      form.reset();
      router.push("/admin/informations");
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: `お知らせの${defaultValues ? "更新" : "作成"}に失敗しました`,
      });
      console.error(error);
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>投稿日</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>お知らせの投稿日を選択してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>タイトル</FormLabel>
              <FormControl>
                <Input placeholder="例: 10月のイベントのお知らせ" {...field} />
              </FormControl>
              <FormDescription>お知らせのタイトルを入力してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>本文</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="お知らせの内容を入力してください"
                  rows={10}
                  {...field}
                />
              </FormControl>
              <FormDescription>お知らせの詳細を入力してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>アイキャッチ画像（任意）</FormLabel>
              <FormControl>
                <InputImage
                  width={400}
                  aspectRatio={16 / 9}
                  resultWidth={800}
                  value={field.value}
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

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>リンクURL（任意）</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>外部リンクのURLを入力してください</FormDescription>
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

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">公開状態</FormLabel>
                <FormDescription>
                  公開するとユーザーに表示されます
                </FormDescription>
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

        <FormField
          control={form.control}
          name="isMemberOnly"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">会員限定</FormLabel>
                <FormDescription>
                  ONにすると会員のみ閲覧可能になります
                </FormDescription>
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

        <Button type="submit" disabled={isSubmitting}>
          {defaultValues ? "お知らせを更新" : "お知らせを作成"}
        </Button>
      </form>
    </Form>
  );
}
