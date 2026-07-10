import { z } from "zod";
import {
  BookingStatus,
  PaymentStatus,
  UserActiveStatus,
} from "../../../generated/prisma/enums";
export const updateUserStatus = z.object({
  body: z.object({
    status: z.enum([
      UserActiveStatus.ACTIVE,
      UserActiveStatus.BLOCKED,
      UserActiveStatus.INACTIVE,
    ]),
  }),
});

//query schema
export const BookingSearchSchema = z.object({
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
    .optional()
    .default("COMPLETED"),
  customerId: z.string().optional(),
  serviceId: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
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
