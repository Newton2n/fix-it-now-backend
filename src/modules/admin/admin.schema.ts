import { z } from "zod";
import {
  BookingStatus,
  PaymentProvider,
  PaymentStatus,
  UserActiveStatus,
  UserRole,
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
export const AdminBookingSearchSchema = z.object({
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

//user search schema

export const UserSearchSchema = z.object({
  search: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.email().optional(),
  role: z
    .enum([UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.CUSTOMER])
    .optional(),
  status: z
    .enum([
      UserActiveStatus.ACTIVE,
      UserActiveStatus.BLOCKED,
      UserActiveStatus.INACTIVE,
    ])
    .optional(),
  country: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  sortBy: z.enum(["name", "role", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});



//review search schema 

export const ReviewSearchSchema = z.object({
  customerId: z.uuid().optional(),
  serviceId: z.uuid().optional(), 
  minRating: z.coerce.number().int().min(1).max(5).optional(),
  maxRating: z.coerce.number().int().min(1).max(5).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  sortBy: z.enum(["rating", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});



// payments search schema


export const PaymentSearchSchema = z.object({
  transactionId: z.string().optional(),
  status: z.enum([PaymentStatus.FAILED,PaymentStatus.PENDING,PaymentStatus.SUCCEEDED]).optional(),
  provider: z.enum([PaymentProvider.SSLCOMMERZ,PaymentProvider.STRIPE]).optional(),
  minAmount: z.coerce.number().positive().optional(),
  maxAmount: z.coerce.number().positive().optional(),
  sortBy: z.enum(["amount", "createdAt", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
});