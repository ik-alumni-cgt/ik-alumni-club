import { sponsors } from "@/db/schemas/sponsors"

export type Sponsor = typeof sponsors.$inferSelect
