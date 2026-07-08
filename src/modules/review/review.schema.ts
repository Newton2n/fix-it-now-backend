import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    bookingId: z.uuid("Valid uuid required"),
    rating :z.number().min(1,"Minimum 1 rating needed").max(5,"Maximum 5 star rating"),
    description: z
      .string()
      .min(5, "Description must be at least 5 letters long")
      .max(255, "description  must be less than 101 letters"),
  }),
});
export const updateReviewSchema = z.object({
  body: z.object({
    bookingId: z.uuid("Valid uuid required"),
    rating :z.number().min(1,"Minimum 1 rating needed").max(5,"Maximum 5 star rating").optional(),
    description: z
      .string()
      .min(5, "Description must be at least 5 letters long")
      .max(255, "description  must be less than 101 letters").optional(),
  }),
});


