"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { photoLibraryFormSchema, type PhotoLibraryFormData } from "@/zod/photo-library";
import { createPhoto, updatePhoto, generatePresignedUrls } from "@/actions/photo-library";
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
import { InputMultipleImages } from "@/components/input-multiple-images";
import { CategorySelect } from "@/components/admin/category-select";
import type { CategoryWithChildren } from "@/types/category";
import { updatePhotoLibraryCategories } from "@/actions/category";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useState, useCallback } from "react";

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mimeType = header?.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const binary = atob(base64 ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

interface PhotoLibraryFormProps {
  defaultValues?: PhotoLibraryFormData & { id?: string };
  mode: "create" | "edit";
  categoriesTree?: CategoryWithChildren[];
  initialCategoryIds?: string[];
}

export function PhotoLibraryForm({
  defaultValues,
  mode,
  categoriesTree = [],
  initialCategoryIds = [],
}: PhotoLibraryFormProps) {
  const router = useRouter();
  const [categoryIds, setCategoryIds] = useState<string[]>(initialCategoryIds);
  const form = useForm<PhotoLibraryFormData>({
    resolver: zodResolver(photoLibraryFormSchema),
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          publishedAt: defaultValues.publishedAt
            ? typeof defaultValues.publishedAt === "string"
              ? defaultValues.publishedAt
              : new Date(defaultValues.publishedAt as unknown as string).toISOString().split("T")[0]
            : "",
        }
      : {
          title: "",
          description: "",
          coverImageUrl: "",
          publishedAt: "",
          published: false,
          isMemberOnly: true,
          images: [{ imageUrl: "", caption: "" }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const handleMultipleImagesAdded = useCallback(
    (imageUrls: string[]) => {
      console.log("[PhotoLibraryForm] handleMultipleImagesAdded called with", imageUrls.length, "images");
      console.log("[PhotoLibraryForm] First image URL preview:", imageUrls[0]?.substring(0, 100));

      // 空の画像スロットがある場合は削除
      const currentImages = form.getValues("images");
      console.log("[PhotoLibraryForm] Current images:", currentImages.length);
      const emptyIndexes = currentImages
        .map((img, idx) => (!img.imageUrl ? idx : -1))
        .filter((idx) => idx !== -1)
        .reverse();

      console.log("[PhotoLibraryForm] Removing empty indexes:", emptyIndexes);
      emptyIndexes.forEach((idx) => remove(idx));

      // 新しい画像を追加
      imageUrls.forEach((url, i) => {
        console.log(`[PhotoLibraryForm] Appending image ${i + 1}`);
        append({ imageUrl: url, caption: "" });
      });

      console.log("[PhotoLibraryForm] After append, images:", form.getValues("images").length);
      toast.success(`${imageUrls.length}枚の画像を追加しました`);
    },
    [form, append, remove]
  );

  const onSubmit = async (data: PhotoLibraryFormData) => {
    try {
      // Step 1: 新規アップロードが必要な画像（dataURL）を特定
      const newImages = data.images
        .map((img, index) => ({ ...img, index }))
        .filter((img) => img.imageUrl.startsWith("data:"));
      const coverNeedsUpload =
        data.coverImageUrl && data.coverImageUrl.startsWith("data:");

      const presignedRequests = [
        ...newImages.map(() => ({ contentType: "image/jpeg" as const })),
        ...(coverNeedsUpload ? [{ contentType: "image/jpeg" as const }] : []),
      ];

      // Step 2: Presigned URL を取得（軽量リクエスト）
      const presignedResults =
        presignedRequests.length > 0
          ? await generatePresignedUrls(presignedRequests)
          : [];

      // Step 3: クライアントから R2 に直接 PUT アップロード（並列）
      await Promise.all(
        presignedResults.map(async (result, i) => {
          const isImageUpload = i < newImages.length;
          const dataUrl = isImageUpload
            ? newImages[i].imageUrl
            : data.coverImageUrl!;
          const blob = dataUrlToBlob(dataUrl);
          const response = await fetch(result.presignedUrl, {
            method: "PUT",
            body: blob,
            headers: { "Content-Type": "image/jpeg" },
          });
          if (!response.ok) {
            throw new Error(`画像のアップロードに失敗しました (${response.status})`);
          }
        })
      );

      // Step 4: imageUrl を publicUrl に差し替え
      let presignedIndex = 0;
      const resolvedImages = data.images.map((img) => {
        if (img.imageUrl.startsWith("data:")) {
          const publicUrl = presignedResults[presignedIndex].publicUrl;
          presignedIndex++;
          return { ...img, imageUrl: publicUrl };
        }
        return img;
      });
      const resolvedCoverImageUrl = coverNeedsUpload
        ? presignedResults[presignedResults.length - 1].publicUrl
        : data.coverImageUrl;

      const resolvedData = {
        ...data,
        images: resolvedImages,
        coverImageUrl: resolvedCoverImageUrl,
      };

      // Step 5: DB 保存（URL文字列のみ送信）
      if (mode === "create") {
        const created = await createPhoto(resolvedData);
        if (created) {
          await updatePhotoLibraryCategories(created.id, categoryIds);
        }
        toast.success("フォトを作成しました", {
          description: `${data.title}を作成しました`,
        });
      } else if (defaultValues?.id) {
        await updatePhoto(defaultValues.id, resolvedData);
        await updatePhotoLibraryCategories(defaultValues.id, categoryIds);
        toast.success("フォトを更新しました", {
          description: `${data.title}を更新しました`,
        });
      }
      router.push("/admin/photo-library");
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: `フォトの${mode === "create" ? "作成" : "更新"}に失敗しました`,
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
                <Input placeholder="アルバムのタイトル" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 説明 */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>説明</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="アルバムの説明（任意）"
                  rows={3}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                アルバムについての説明文です
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 画像一覧 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>画像 *</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ imageUrl: "", caption: "" })}
            >
              <Plus className="h-4 w-4 mr-2" />
              1枚追加
            </Button>
          </div>
          <FormDescription>
            少なくとも1枚の画像を追加してください
          </FormDescription>

          {/* 一括アップロードエリア */}
          <InputMultipleImages
            aspectRatio={4 / 3}
            resultWidth={1200}
            onImagesAdded={handleMultipleImagesAdded}
          />

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 p-4 border rounded-lg">
              <div className="flex items-center text-muted-foreground">
                <GripVertical className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name={`images.${index}.imageUrl`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>画像 {index + 1}</FormLabel>
                      <FormControl>
                        <InputImage
                          width={300}
                          aspectRatio={4 / 3}
                          resultWidth={1200}
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`images.${index}.caption`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>キャプション（任意）</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="画像の説明"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {form.formState.errors.images?.root && (
            <p className="text-sm text-destructive">
              {form.formState.errors.images.root.message}
            </p>
          )}
        </div>

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
