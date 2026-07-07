import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "category name must be at least 3 letters long")
      .max(100, "category name must be less than 101 letters"),
    description: z
      .string()
      .min(6, "Description must be at least 10 letters long")
      .max(255, "description  must be less than 101 letters"),
  }),
});

// model Category {
//     id          String @id @default(uuid())
//     name        String @db.VarChar(100) @unique
//     description String

//     service            Service[]

//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt

//     @@map("categories")
// }
