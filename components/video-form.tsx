"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { videoFormSchema, VideoFormData } from "@/zod/video";
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { createVideo, updateVideo } from "@/actions/video";
import { updateVideoCategories } from "@/actions/category";
import { toast } from "sonner";
import { Video } from "@/types/video";
import { CategorySelect } from "@/components/admin/category-select";
import type { CategoryWithChildren } from "@/types/category";

export function VideoForm({
  defaultValues,
  categoriesTree = [],
  initialCategoryIds = [],
}: {
  defaultValues?: Video;
  categoriesTree?: CategoryWithChildren[];
  initialCategoryIds?: string[];
}) {
  const router = useRouter();
  const [categoryIds, setCategoryIds] = useState<string[]>(initialCategoryIds);
  const form = useForm<VideoFormData>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          videoDate: defaultValues.videoDate,
          videoUrl: defaultValues.videoUrl,
          thumbnailUrl: defaultValues.thumbnailUrl ?? "",
          published: defaultValues.published,
          isMemberOnly: defaultValues.isMemberOnly,
          viewCount: defaultValues.viewCount,
        }
      : {
          title: "",
          videoDate: new Date().toISOString().split("T")[0],
          videoUrl: "",
          thumbnailUrl: "",
          published: false,
          isMemberOnly: false,
          viewCount: 0,
        },
  });

  async function onSubmit(data: VideoFormData) {
    try {
      if (defaultValues) {
        await updateVideo(defaultValues.id, data);
        await updateVideoCategories(defaultValues.id, categoryIds);
        toast.success("動画を更新しました", {
          description: `${data.title}を更新しました`,
        });
      } else {
        const created = await createVideo(data);
        if (created) {
          await updateVideoCategories(created.id, categoryIds);
        }
        toast.success("動画を作成しました", {
          description: `${data.title}を作成しました`,
        });
      }
      form.reset();
      router.push("/admin/videos");
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: `動画の${defaultValues ? "更新" : "作成"}に失敗しました`,
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
              <FormLabel>動画タイトル</FormLabel>
              <FormControl>
                <Input placeholder="例: 第3回定期公演ダイジェスト" {...field} />
              </FormControl>
              <FormDescription>動画のタイトルを入力してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="videoDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>投稿日</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>動画の投稿日を選択してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  {...field}
                />
              </FormControl>
              <FormDescription>YouTubeの動画URLを入力してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnailUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>サムネイルURL（任意）</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/thumbnail.jpg"
                  {...field}
                />
              </FormControl>
              <FormDescription>サムネイル画像のURLを入力してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="viewCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>閲覧数</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>
                閲覧数を入力してください（将来的な拡張用）
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
          {defaultValues ? "動画を更新" : "動画を作成"}
        </Button>
      </form>
    </Form>
  );
}
