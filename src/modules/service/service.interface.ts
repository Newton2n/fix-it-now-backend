import { z } from "zod";
import { createServiceSchema, updateServiceSchema } from "./service.schema";

export type TCreateServicePayload = z.infer<typeof createServiceSchema>["body"];
export type TUpdateServicePayload = z.infer<typeof updateServiceSchema>["body"];
