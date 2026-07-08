import { Router } from "express";
import { technicianController } from "./technician.controller";
import { authMiddleware } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { UserRole } from "../../../generated/prisma/enums";
import {
  changeAvailabilityPayload,
  technicianProfileUpdateStatus,
  technicianRegisterSchema,
  technicianUpdateSchema,
} from "./technician.schema";
const technicianRoute = Router();

//create technician profile
technicianRoute.get("/", technicianController.getAll);
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
technicianRoute.patch(
  "/availability",
  authMiddleware.auth(UserRole.TECHNICIAN),
  validate(changeAvailabilityPayload),
  technicianController.updateAvailability,
);

//get login user technician profile
technicianRoute.get(
  "/me",
  authMiddleware.auth(UserRole.TECHNICIAN),
  technicianController.getMe,
);

// get booking by log in technician
technicianRoute.get(
  "/bookings",
  authMiddleware.auth(UserRole.TECHNICIAN),
  technicianController.getBookings,
);
// get all reviews for a technician
technicianRoute.get(
  "/:technicianId/reviews",
  technicianController.getAllReviews,
);
//verify technician profile
technicianRoute.patch(
  "/admin/:technicianId/verify",
  authMiddleware.auth(UserRole.ADMIN),
  validate(technicianProfileUpdateStatus),
  technicianController.verify,
);

export default technicianRoute;
