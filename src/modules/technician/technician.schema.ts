import { z } from "zod";
export const technicianRegisterSchema = z.object({
  body: z.object({
    bio: z.string().min(10, "Minimum 10 character required").optional(),
    skills: z.array(z.string({ error: "Skills must be strings" })),
    yearsOfExperience: z
      .number()
      .min(0, "Experience cannot be negative")
      .max(100),
    availability: z.object({
      monday: z.string().optional(),
      tuesday: z.string().optional(),
      wednesday: z.string().optional(),
      thursday: z.string().optional(),
      friday: z.string().optional(),
      saturday: z.string().optional(),
      sunday: z.string().optional(),
    }),
    serviceArea: z.array(z.string({ error: "Service areas must be strings" })),
  }),
});

// model TechnicianProfile {
//     id                 String               @id @default(uuid())
//     userId             String               @unique
//     bio                String?
//     skills             String[]
//     isAvailable        Boolean               @default(true)
//     yearsOfExperience  Decimal
//     availability       Json
//     status             TechnicianStatus       @default(PENDING_APPROVAL)
//     serviceArea        String[]

//     service Service[]

//     user User @relation(fields: [userId], references: [id])

//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt

//     @@map("technicianProfiles")
// }
