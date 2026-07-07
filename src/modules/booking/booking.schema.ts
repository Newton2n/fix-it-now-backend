import { z } from "zod";
import { BookingStatus } from "../../../generated/prisma/enums";
export const createBookingSchema = z.object({
  body: z.object({
    serviceId: z.uuid("Invalid service ID"),
    scheduledAt: z.coerce.date("valid date time required"),
    location: z
      .string()
      .trim()
      .min(5, "Location must be at least 5 characters")
      .max(255, "Location cannot exceed 255 characters"),
    customerNote: z
      .string()
      .trim()
      .min(5, "Customer note must be at least 5 characters")
      .max(500, "Customer note cannot exceed 500 characters")
      .optional(),
  }),
});
export const updateBookingStatusPayload = z.object({
  body: z.object({
    status : z.enum([BookingStatus.ACCEPTED,BookingStatus.COMPLETED,BookingStatus.DECLINED,BookingStatus.IN_PROGRESS,])
  }),
});

