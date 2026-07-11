import { z } from "zod";
import { BookingSearchSchema, PaymentSearchSchema, ReviewSearchSchema, UserSearchSchema } from "./admin.schema";

export type TBookingSearchQuery = z.infer<typeof BookingSearchSchema>;
export type TUserSearchQuery = z.infer<typeof UserSearchSchema>
export type TReviewSearchQuery = z.infer<typeof ReviewSearchSchema>
export type TPaymentSearchQuery = z.infer<typeof PaymentSearchSchema>