import { z } from "zod";
import { createReviewSchema } from "./review.schema";

export type TCreateReviewPayload = z.infer<
  typeof createReviewSchema
>["body"];