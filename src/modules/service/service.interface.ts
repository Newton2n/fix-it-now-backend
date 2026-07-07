import {z} from "zod"
import { createServiceSchema } from "./service.schema"



export type TCreateServicePayload = z.infer<typeof createServiceSchema>["body"]