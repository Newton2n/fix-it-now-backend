import { z } from "zod";
import { UserActiveStatus } from "../../../generated/prisma/enums";
export const updateUserStatus = z.object({
  body: z.object({
     status: z.enum([
        UserActiveStatus.ACTIVE,
        UserActiveStatus.BLOCKED,
        UserActiveStatus.INACTIVE
    ]),
  }),
});