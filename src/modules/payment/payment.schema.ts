import { z } from "zod";
import { PaymentProvider, PaymentStatus } from "../../../generated/prisma/enums";

export const createSession = z.object({
  body: z.object({
    bookingId :z.uuid("Valid id required")
  }),
});



// payments search schema

export const UserPaymentSearchSchema = z.object({
  transactionId: z.string().optional(),
  status: z
    .enum([
      PaymentStatus.FAILED,
      PaymentStatus.PENDING,
      PaymentStatus.SUCCEEDED,
    ])
    .optional(),
  provider: z
    .enum([PaymentProvider.SSLCOMMERZ, PaymentProvider.STRIPE])
    .optional(),
  minAmount: z.coerce.number().positive().optional(),
  maxAmount: z.coerce.number().positive().optional(),
  sortBy: z.enum(["amount", "createdAt", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
});
