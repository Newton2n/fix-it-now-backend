import { z } from "zod";
import { AdminBookingSearchSchema, PaymentSearchSchema, ReviewSearchSchema, UserSearchSchema } from "./admin.schema";

export type TBookingSearchQuery = z.infer<typeof AdminBookingSearchSchema>;
export type TUserSearchQuery = z.infer<typeof UserSearchSchema>
export type TReviewSearchQuery = z.infer<typeof ReviewSearchSchema>
export type TPaymentSearchQuery = z.infer<typeof PaymentSearchSchema>