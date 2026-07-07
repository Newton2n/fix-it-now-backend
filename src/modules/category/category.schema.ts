import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "category name must be at least 3 letters long")
      .max(100, "category name must be less than 101 letters"),
    description: z
      .string()
      .min(6, "Description must be at least 10 letters long")
      .max(255, "description  must be less than 101 letters"),
  }),
});
export const updateCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "category name must be at least 3 letters long")
      .max(100, "category name must be less than 101 letters").optional()
      ,
    description: z
      .string()
      .min(6, "Description must be at least 10 letters long")
      .max(255, "description  must be less than 101 letters").optional()
      ,
  }),
});
