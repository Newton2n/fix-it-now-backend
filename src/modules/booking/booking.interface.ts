import { z } from "zod";
import { createBookingSchema } from "./booking.schema";

export type TCreateBookingPayload = z.infer<
  typeof createBookingSchema
>["body"];


export type TTechnicianTimeSchedule = {
  [key: string]: { start: string; end: string };
};
