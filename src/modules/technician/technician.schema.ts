import { z } from "zod";
import { TechnicianStatus } from "../../../generated/prisma/enums";

const daySchema = z.object({
  start: z.string(),
  end: z.string(),
});
export const technicianRegisterSchema = z.object({
  body: z.object({
    bio: z.string().min(10, "Minimum 10 character required").optional(),
    skills: z.array(z.string({ error: "Skills must be strings" })),
    yearsOfExperience: z
      .number()
      .min(0, "Experience cannot be negative")
      .max(100),
    availability: z.object({
      monday: daySchema.optional(),
      tuesday: daySchema.optional(),
      wednesday: daySchema.optional(),
      thursday: daySchema.optional(),
      friday: daySchema.optional(),
      saturday: daySchema.optional(),
      sunday: daySchema.optional(),
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
        monday: daySchema.optional(),
        tuesday: daySchema.optional(),
        wednesday: daySchema.optional(),
        thursday: daySchema.optional(),
        friday: daySchema.optional(),
        saturday: daySchema.optional(),
        sunday: daySchema.optional(),
      })
      .optional(),
    serviceArea: z
      .array(z.string({ error: "Service areas must be strings" }))
      .optional(),
  }),
});

export const changeAvailabilityPayload = z.object({
  body: z.object({
    availability: z.object({
      monday: daySchema.optional(),
      tuesday: daySchema.optional(),
      wednesday: daySchema.optional(),
      thursday: daySchema.optional(),
      friday: daySchema.optional(),
      saturday: daySchema.optional(),
      sunday: daySchema.optional(),
    }),
  }),
});

export const technicianProfileUpdateStatus = z.object({
  body: z.object({
      status: z.enum([
        TechnicianStatus.PENDING_APPROVAL,
        TechnicianStatus.SUSPENDED,
        TechnicianStatus.VERIFIED
      ]),
    }),
});