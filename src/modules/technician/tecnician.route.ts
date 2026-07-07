import { Router } from "express";
import { technicianController } from "./technician.controller";
import { authMiddleware } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { UserRole } from "../../../generated/prisma/enums";
import { technicianRegisterSchema } from "./technician.schema";
const technicianRoute = Router();

//create technician profile
technicianRoute.post(
  "/profile",
  authMiddleware.auth(UserRole.TECHNICIAN),
  validate(technicianRegisterSchema),
  technicianController.create,
);
technicianRoute.post("/profile/:id", technicianController.getProfile);
technicianRoute.patch("/profile", technicianController.updateProfile);
technicianRoute.patch("/availability", technicianController.updateAvailability);
technicianRoute.get("/me", technicianController.getMe);
technicianRoute.get("/bookings", technicianController.getBookings);

export default technicianRoute;
