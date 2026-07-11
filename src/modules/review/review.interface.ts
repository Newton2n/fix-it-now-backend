import { z } from "zod";
import {
  createReviewSchema,
  updateReviewSchema,
  UserReviewSearchSchema,
} from "./review.schema";

export type TCreateReviewPayload = z.infer<typeof createReviewSchema>["body"];
export type TUpdateReviewPayload = z.infer<typeof updateReviewSchema>["body"];
export type TUserReviewSearchQuery = z.infer<typeof UserReviewSearchSchema>;
