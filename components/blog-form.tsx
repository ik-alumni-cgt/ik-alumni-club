"use client";

import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogFormSchema, type BlogFormData } from "@/zod/blog";
import { createBlog, updateBlog } from "@/actions/blog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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

const TiptapEditor = dynamic(
  () => import("@/components/editor/tiptap-editor").then((m) => m.TiptapEditor),
  {
    ssr: false,
    loading: () => (
      <div className="border rounded-md min-h-64 bg-muted/30 animate-pulse" />
    ),
  }
);

interface BlogFormProps {
  defaultValues?: BlogFormData & { id?: string };
  mode: "create" | "edit";
}

export function BlogForm({ defaultValues, mode }: BlogFormProps) {
  const router = useRouter();
  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: defaultValues || {
      title: "",
      excerpt: "",
      content: "",
      thumbnailUrl: "",
      published: false,
      isMemberOnly: false,
    },
  });

  const onSubmit = async (data: BlogFormData) => {
    try {
      if (mode === "create") {
        await createBlog(data);
        toast.success("ブログを作成しました", {
          description: `${data.title}を作成しました`,
        });
      } else if (defaultValues?.id) {
        await updateBlog(defaultValues.id, data);
        toast.success("ブログを更新しました", {
          description: `${data.title}を更新しました`,
        });
      }
      router.push("/admin/blogs");
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: `ブログの${mode === "create" ? "作成" : "更新"}に失敗しました`,
      });
      console.error(error);
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* タイトル */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>タイトル *</FormLabel>
              <FormControl>
                <Input placeholder="ブログのタイトル" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 抜粋 */}
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>抜粋 *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="記事の要約（100-300文字推奨）"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                一覧ページで表示される記事の要約です
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
                <TiptapEditor
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
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

        {/* 公開フラグ */}
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">公開状態</FormLabel>
                <FormDescription>
                  公開すると一般ユーザーに表示されます
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

        {/* 会員限定フラグ */}
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

        {/* ボタン */}
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
