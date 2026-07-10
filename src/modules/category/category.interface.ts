import { z } from "zod";
import { CategorySearchSchema, createCategorySchema, updateCategorySchema } from "./category.schema";

export type TCreateCategoryPayload = z.infer<
  typeof createCategorySchema
>["body"];
export type TUpdateCategoryPayload = z.infer<
  typeof updateCategorySchema
>["body"];

//query type
export type TCategorySearchFilters = z.infer<typeof CategorySearchSchema>;