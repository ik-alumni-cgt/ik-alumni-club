import { categories } from "@/db/schemas/categories";

export type Category = typeof categories.$inferSelect;

export type CategoryWithChildren = Category & {
  children: Category[];
};
