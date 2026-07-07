import { z } from "zod";
import { technicianRegisterSchema } from "./technician.schema";

export type TCreateTechnicianProfilePayload = z.infer<
  typeof technicianRegisterSchema
>["body"];
