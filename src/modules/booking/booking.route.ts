import { Router } from "express";
import { bookingController } from "./booking.controller";
import { authMiddleware } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { validate } from "../../middleware/validate";
import { createBookingSchema } from "./booking.schema";
const bookingRoute = Router();

// create booking
bookingRoute.post(
  "/",
  authMiddleware.auth(UserRole.CUSTOMER),
  validate(createBookingSchema),
  bookingController.create,
);
//get all booking by log in customer
bookingRoute.get(
  "/",
  authMiddleware.auth(UserRole.CUSTOMER, UserRole.TECHNICIAN),
  bookingController.getAll,
);
//get booking details
bookingRoute.patch(
  "/:id",
  authMiddleware.auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.TECHNICIAN),
  bookingController.getDetails,
);
//update service by technician
bookingRoute.patch(
  "/:id",
  authMiddleware.auth(UserRole.TECHNICIAN),
  bookingController.update,
);

export default bookingRoute;
