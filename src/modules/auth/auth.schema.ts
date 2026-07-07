import {z } from "zod";

export const userLoginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 letters long"),
  }),
});

export const userRegisterSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Minimum 3 character required"),
    phoneNumber: z.string().optional(),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 letters long"),
    roles: z.enum(["CUSTOMER", "TECHNICIAN"]),
    country: z.string().optional(),
    profilePicture: z.url({ error: "Invalid image URL layout" }).optional(),
  }),
});

// export interface TRegistrationPayload {
//   name: string;
//   phoneNumber?: string;
//   email: string;
//   password: string;
//   roles: "CUSTOMER" | "TECHNICIAN";
//   country?: string;
//   profilePicture?: string;
// }
