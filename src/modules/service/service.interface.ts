import { z } from "zod";
import { createServiceSchema, ServiceSearchFiltersSchema, updateServiceSchema } from "./service.schema";

export type TCreateServicePayload = z.infer<typeof createServiceSchema>["body"];
export type TUpdateServicePayload = z.infer<typeof updateServiceSchema>["body"];


//query types
export type TSearchFilters = z.infer<typeof ServiceSearchFiltersSchema>;