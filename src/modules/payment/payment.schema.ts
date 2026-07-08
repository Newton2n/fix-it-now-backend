import { z } from "zod";

export const createSession = z.object({
  body: z.object({
    bookingId :z.uuid("Valid id required")
  }),
});