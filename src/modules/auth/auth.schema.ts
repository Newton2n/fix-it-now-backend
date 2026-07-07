import { z } from "zod";

export const userLoginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 letters long"),
  }),
});
