import { z } from "zod";
import { createCategorySchema, updateCategorySchema } from "./category.schema";

export type TCreateCategoryPayload = z.infer<
  typeof createCategorySchema
>["body"];
export type TUpdateCategoryPayload = z.infer<
  typeof updateCategorySchema
>["body"];
