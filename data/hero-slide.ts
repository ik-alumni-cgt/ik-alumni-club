import "server-only";
import { db } from "@/db";
import { heroSlides } from "@/db/schemas/hero-slides";
import { asc, eq } from "drizzle-orm";
import type { HeroSlideType } from "@/zod/hero-slide";

/**
 * 指定 type のヒーロー画像を表示順で取得する
 */
export const getHeroSlides = async (type: HeroSlideType) => {
  return db.query.heroSlides.findMany({
    where: eq(heroSlides.type, type),
    orderBy: [asc(heroSlides.sortOrder)],
  });
};
