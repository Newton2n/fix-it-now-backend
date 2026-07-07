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
export const technicianUpdateSchema = z.object({
  body: z.object({
    bio: z.string().min(10, "Minimum 10 character required").optional(),
    skills: z.array(z.string({ error: "Skills must be strings" })).optional(),
    yearsOfExperience: z
      .number()
      .min(0, "Experience cannot be negative")
      .max(100)
      .optional(),
    availability: z
      .object({
        monday: z.string().optional(),
        tuesday: z.string().optional(),
        wednesday: z.string().optional(),
        thursday: z.string().optional(),
        friday: z.string().optional(),
        saturday: z.string().optional(),
        sunday: z.string().optional(),
      })
      .optional(),
    serviceArea: z
      .array(z.string({ error: "Service areas must be strings" }))
      .optional(),
  }),
});


export const changeAvailabilityPayload = z.object({
  body: z.object({
    availability: z
      .object({
        monday: z.string().optional(),
        tuesday: z.string().optional(),
        wednesday: z.string().optional(),
        thursday: z.string().optional(),
        friday: z.string().optional(),
        saturday: z.string().optional(),
        sunday: z.string().optional(),
      })
  }),
});