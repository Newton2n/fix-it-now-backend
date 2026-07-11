import { z } from "zod";
import { BookingSearchSchema, ReviewSearchSchema, UserSearchSchema } from "./admin.schema";

export type TBookingSearchQuery = z.infer<typeof BookingSearchSchema>;
export type TUserSearchQuery = z.infer<typeof UserSearchSchema>
export type TReviewSearchQuery = z.infer<typeof ReviewSearchSchema>