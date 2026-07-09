import { z } from "zod";

export const userUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Minimum 3 character required").optional(),
    phoneNumber: z.string().optional(),
    role: z.enum(["CUSTOMER", "TECHNICIAN"]).optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    country: z.string().optional(),
    profilePicture: z.url({ error: "Invalid image URL layout" }).optional(),
  }),
});

export const userUpdatePassword = z.object({
  body: z.object({
    oldPassword: z.string().min(6, "Password must be at least 6 letters long"),
    newPassword: z.string().min(6, "Password must be at least 6 letters long"),
  }),
});
