import { photoLibrary, photoLibraryImages } from "@/db/schemas/photo-library";
import { photoLibraryFormSchema } from "@/zod/photo-library";
import { z } from "zod";

// DBから取得したフォトライブラリデータの型
export type PhotoLibrary = typeof photoLibrary.$inferSelect;

// DBから取得した画像データの型
export type PhotoLibraryImage = typeof photoLibraryImages.$inferSelect;

// フォーム入力データの型
export type PhotoLibraryFormData = z.infer<typeof photoLibraryFormSchema>;

// リレーション含むフォトライブラリデータの型
export type PhotoLibraryWithImages = PhotoLibrary & {
  images: PhotoLibraryImage[];
  creator: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  } | null;
};
