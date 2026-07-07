import { z } from "zod";
import { createBookingSchema } from "./booking.schema";

export type TCreateBookingPayload = z.infer<
  typeof createBookingSchema
>["body"];