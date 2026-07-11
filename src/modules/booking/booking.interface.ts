import { z } from "zod";
import { createBookingSchema, UserBookingSearchSchema } from "./booking.schema";

export type TCreateBookingPayload = z.infer<
  typeof createBookingSchema
>["body"];


export type TTechnicianTimeSchedule = {
  [key: string]: { start: string; end: string };
};

export type TUserBookingSearchQuery = z.infer<typeof UserBookingSearchSchema>