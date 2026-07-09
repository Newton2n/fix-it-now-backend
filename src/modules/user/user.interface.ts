import { z } from "zod";
import { userUpdatePassword, userUpdateSchema } from "./user.schema";

export type TUserUpdatePayload = z.infer<typeof userUpdateSchema>["body"];
export type TUserUpdatePasswordPayload = z.infer<typeof userUpdatePassword>["body"];