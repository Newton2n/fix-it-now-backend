import { z } from "zod";
import { BookingSearchSchema, UserSearchSchema } from "./admin.schema";

export type TBookingSearchQuery = z.infer<typeof BookingSearchSchema>;
export type TUserSearchQuery = z.infer<typeof UserSearchSchema>