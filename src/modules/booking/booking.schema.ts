import { z } from "zod";
import { BookingStatus, PaymentStatus } from "../../../generated/prisma/enums";
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
    status: z.enum([
      BookingStatus.ACCEPTED,
      BookingStatus.DECLINED,
      BookingStatus.IN_PROGRESS,
      BookingStatus.COMPLETED,
    ]),
  }),
});

//booking search schema
export const UserBookingSearchSchema = z.object({
  status: z
    .enum([
      BookingStatus.ACCEPTED,
      BookingStatus.CANCELED,
      BookingStatus.COMPLETED,
      BookingStatus.DECLINED,
      BookingStatus.PAID,
      BookingStatus.IN_PROGRESS,
      BookingStatus.REQUESTED,
    ])
    .optional(),
  serviceId: z.uuid().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(5),
  sortBy: z.enum(["scheduledAt", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  paymentStatus: z
    .enum([
      PaymentStatus.PENDING,
      PaymentStatus.FAILED,
      PaymentStatus.SUCCEEDED,
    ])
    .optional()
    .default("SUCCEEDED"),
});
