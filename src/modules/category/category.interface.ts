import { z } from "zod";
import { createCategorySchema } from "./category.schema";

export type TCreateCategoryPayload = z.infer<typeof createCategorySchema>["body"];