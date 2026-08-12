import { z } from "zod";
import { userSetPassword, userUpdatePassword, userUpdateSchema } from "./user.schema";

export type TUserUpdatePayload = z.infer<typeof userUpdateSchema>["body"];
export type TUserUpdatePasswordPayload = z.infer<typeof userUpdatePassword>["body"];
export type TUserSetPasswordPayload = z.infer<typeof userSetPassword>["body"];