import { z } from "zod";

export const createServiceSchema = z.object({
  body: z.object({
    categoryId :z.uuid("Invalid category ID"),
    title: z
      .string()
      .min(3, "category name must be at least 3 letters long")
      .max(100, "category name must be less than 101 letters"),
    description: z
      .string()
      .min(6, "Description must be at least 10 letters long")
      .max(255, "description must be less than 255 letters")
      .optional(),
    price: z.number().min(0, "Price should be positive value"),
    currency: z.string().min(1, "Minimum 1 letter required"),
    isAvailable: z.boolean().optional(),
    thumbnailImage: z.url().min(1, "Valid url required").optional(),
    galleryImage: z.array(z.url({ error: "Valid url required" })).optional(),
  }),
});


