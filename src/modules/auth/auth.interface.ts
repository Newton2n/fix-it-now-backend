import z from "zod";
import { userLoginSchema } from "./auth.schema";

export interface TRegistrationPayload {
  name: string;
  phoneNumber: string;
  email?: string;
  password: string;
  roles: "CUSTOMER" | "TECHNICIAN";
  country?: string;
  profilePicture?: string;
}



export type TLoginPayload = z.infer<typeof userLoginSchema>["body"];