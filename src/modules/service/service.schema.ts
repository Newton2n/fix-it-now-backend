import { z } from "zod";
import { CurrencyAllowed } from "../../../generated/prisma/enums";

export const createServiceSchema = z.object({
  body: z.object({
    categoryId: z.uuid("Invalid category ID"),
    title: z
      .string()
      .min(3, "title must be at least 3 letters long")
      .max(100, "title must be less than 101 letters"),
    description: z
      .string()
      .min(6, "Description must be at least 6 letters long")
      .max(255, "description must be less than 255 letters")
      .optional(),
    price: z.number().min(0, "Price should be positive value"),
    currency: z.enum([CurrencyAllowed.USD]),
    isAvailable: z.boolean().optional(),
    thumbnailImage: z.url().min(1, "Valid url required").optional(),
    galleryImages: z.array(z.url({ error: "Valid url required" })).optional(),
  }),
});
export const updateServiceSchema = z.object({
  body: z.object({
    categoryId: z.uuid("Invalid category ID").optional(),
    title: z
      .string()
      .min(3, "title must be at least 3 letters long")
      .max(100, "title must be less than 101 letters")
      .optional(),
    description: z
      .string()
      .min(6, "Description must be at least 6 letters long")
      .max(255, "description must be less than 255 letters")
      .optional(),
    price: z.number().min(0, "Price should be positive value").optional(),
    currency: z.enum([CurrencyAllowed.USD]),
    isAvailable: z.boolean().optional(),
    thumbnailImage: z.url().min(1, "Valid url required").optional(),
    galleryImages: z.array(z.url({ error: "Valid url required" })).optional(),
  }),
});
