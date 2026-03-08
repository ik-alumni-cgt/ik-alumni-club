"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scheduleFormSchema } from "@/zod/schedule";
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
import { createSchedule, updateSchedule } from "@/actions/schedule";
import { updateScheduleCategories } from "@/actions/category";
import { toast } from "sonner";
import { Schedule, ScheduleFormData } from "@/types/schedule";
import { format } from "date-fns";
import { InputImage } from "@/components/input-image";
import { CategorySelect } from "@/components/admin/category-select";
import type { CategoryWithChildren } from "@/types/category";

export function ScheduleForm({
  defaultValues,
  categoriesTree = [],
  initialCategoryIds = [],
}: {
  defaultValues?: Schedule;
  categoriesTree?: CategoryWithChildren[];
  initialCategoryIds?: string[];
}) {
  const router = useRouter();
  const [categoryIds, setCategoryIds] = useState<string[]>(initialCategoryIds);
  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          content: defaultValues.content,
          eventDate: format(new Date(defaultValues.eventDate), "yyyy-MM-dd'T'HH:mm"),
          imageUrl: defaultValues.imageUrl ?? "",
          linkUrl: defaultValues.linkUrl ?? "",
          sortOrder: defaultValues.sortOrder,
          published: defaultValues.published,
          isMemberOnly: defaultValues.isMemberOnly,
        }
      : {
          title: "",
          content: "",
          eventDate: "",
          imageUrl: "",
          linkUrl: "",
          sortOrder: 0,
          published: false,
          isMemberOnly: false,
        },
  });

  async function onSubmit(data: ScheduleFormData) {
    try {
      if (defaultValues) {
        await updateSchedule(defaultValues.id, data);
        await updateScheduleCategories(defaultValues.id, categoryIds);
        toast.success("スケジュールを更新しました", {
          description: `${data.title}を更新しました`,
        });
      } else {
        const created = await createSchedule(data);
        if (created) {
          await updateScheduleCategories(created.id, categoryIds);
        }
        toast.success("スケジュールを作成しました", {
          description: `${data.title}を作成しました`,
        });
      }
      form.reset();
      router.push("/admin/schedules");
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: `スケジュールの${defaultValues ? "更新" : "作成"}に失敗しました`,
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
                <Input placeholder="例: 柏まつり" {...field} />
              </FormControl>
              <FormDescription>イベントの名前を入力してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>イベント詳細</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="イベントの詳細を入力してください"
                  rows={10}
                  {...field}
                />
              </FormControl>
              <FormDescription>イベントの詳細情報を入力してください</FormDescription>
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

        <FormField
          control={form.control}
          name="linkUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>詳細ページURL（任意）</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>詳細情報ページのURLを入力してください</FormDescription>
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
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>
                表示順を数値で指定してください（小さい数字ほど上に表示されます）
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
          {defaultValues ? "スケジュールを更新" : "スケジュールを作成"}
        </Button>
      </form>
    </Form>
  );
}
