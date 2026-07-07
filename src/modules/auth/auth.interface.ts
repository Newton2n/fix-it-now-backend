import { z } from "zod";
import { userLoginSchema, userRegisterSchema } from "./auth.schema";

export type TRegistrationPayload = z.infer<typeof userRegisterSchema>["body"];
export type TLoginPayload = z.infer<typeof userLoginSchema>["body"];
