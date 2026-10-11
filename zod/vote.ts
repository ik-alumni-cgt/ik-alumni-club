import { z } from "zod";

export const voteChoiceSchema = z.enum(["success", "failure"]);

export type VoteChoice = z.infer<typeof voteChoiceSchema>;

export const castVoteSchema = z.object({
  anonymousId: z.string().min(1).max(64),
  choice: voteChoiceSchema,
});
