import { Router } from "express";
import { technicianController } from "./technician.controller";
import { authMiddleware } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { UserRole } from "../../../generated/prisma/enums";
import {
  technicianRegisterSchema,
  technicianUpdateSchema,
} from "./technician.schema";
const technicianRoute = Router();

//create technician profile
technicianRoute.post(
  "/profile",
  authMiddleware.auth(UserRole.TECHNICIAN),
  validate(technicianRegisterSchema),
  technicianController.create,
);

// get random technician profile details public
technicianRoute.post("/profile/:id", technicianController.getProfile);

//update profile
technicianRoute.patch(
  "/profile",
  authMiddleware.auth(UserRole.TECHNICIAN),
  validate(technicianUpdateSchema),
  technicianController.updateProfile,
);
technicianRoute.patch("/availability", technicianController.updateAvailability);

//get login user technician profile
technicianRoute.get(
  "/me",
  authMiddleware.auth(UserRole.TECHNICIAN),
  technicianController.getMe,
);
technicianRoute.get("/bookings", technicianController.getBookings);

export default technicianRoute;
