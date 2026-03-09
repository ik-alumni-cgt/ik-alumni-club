import { pastEvents } from "@/db/schemas/past-events";
import { pastEventFormSchema } from "@/zod/past-event";
import { z } from "zod";

export type PastEvent = typeof pastEvents.$inferSelect;
export type PastEventFormData = z.infer<typeof pastEventFormSchema>;
