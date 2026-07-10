import { z } from "zod";
import { BookingSearchSchema } from "./admin.schema";

export type TBookingSearchQuery = z.infer<typeof BookingSearchSchema>;