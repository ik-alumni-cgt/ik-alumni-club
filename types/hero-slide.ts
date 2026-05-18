import type { heroSlides } from "@/db/schemas/hero-slides";

export type HeroSlide = typeof heroSlides.$inferSelect;
