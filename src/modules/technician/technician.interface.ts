import { z } from "zod";
import { changeAvailabilityPayload, technicianRegisterSchema, technicianUpdateSchema } from "./technician.schema";

export type TCreateTechnicianProfilePayload = z.infer<
  typeof technicianRegisterSchema
>["body"];
export type TUpdateTechnicianProfilePayload = z.infer<
  typeof technicianUpdateSchema
>["body"];
export type TUpdateAvailabilityPayload = z.infer<
  typeof changeAvailabilityPayload
>["body"];
