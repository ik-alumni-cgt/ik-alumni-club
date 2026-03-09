"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pastEventFormSchema } from "@/zod/past-event";
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
import { createPastEvent, updatePastEvent } from "@/actions/past-event";
import { updatePastEventCategories } from "@/actions/category";
import { toast } from "sonner";
import { PastEvent, PastEventFormData } from "@/types/past-event";
import { format } from "date-fns";
import { InputImage } from "@/components/input-image";
import { CategorySelect } from "@/components/admin/category-select";
import type { CategoryWithChildren } from "@/types/category";

export function PastEventForm({
  defaultValues,
  categoriesTree = [],
  initialCategoryIds = [],
}: {
  defaultValues?: PastEvent;
  categoriesTree?: CategoryWithChildren[];
  initialCategoryIds?: string[];
}) {
  const router = useRouter();
  const [categoryIds, setCategoryIds] = useState<string[]>(initialCategoryIds);
  const form = useForm<PastEventFormData>({
    resolver: zodResolver(pastEventFormSchema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          description: defaultValues.description,
          eventDate: format(new Date(defaultValues.eventDate), "yyyy-MM-dd'T'HH:mm"),
          imageUrl: defaultValues.imageUrl ?? "",
          published: defaultValues.published,
          isMemberOnly: defaultValues.isMemberOnly,
        }
      : {
          title: "",
          description: "",
          eventDate: "",
          imageUrl: "",
          published: false,
          isMemberOnly: false,
        },
  });

  async function onSubmit(data: PastEventFormData) {
    try {
      if (defaultValues) {
        await updatePastEvent(defaultValues.id, data);
        await updatePastEventCategories(defaultValues.id, categoryIds);
        toast.success("過去のイベントを更新しました", {
          description: `${data.title}を更新しました`,
        });
      } else {
        const created = await createPastEvent(data);
        if (created) {
          await updatePastEventCategories(created.id, categoryIds);
        }
        toast.success("過去のイベントを作成しました", {
          description: `${data.title}を作成しました`,
        });
      }
      form.reset();
      router.push("/admin/past-events");
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: `過去のイベントの${defaultValues ? "更新" : "作成"}に失敗しました`,
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>イベント名</FormLabel>
              <FormControl>
                <Input placeholder="例: 第5回同窓会総会" {...field} />
              </FormControl>
              <FormDescription>イベントの名前を入力してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>説明文</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="イベントの説明を入力してください"
                  rows={10}
                  {...field}
                />
              </FormControl>
              <FormDescription>イベントの説明を入力してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>イベント日時</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormDescription>イベントの開催日時を選択してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>イベント画像（任意）</FormLabel>
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
          {defaultValues ? "過去のイベントを更新" : "過去のイベントを作成"}
        </Button>
      </form>
    </Form>
  );
}
