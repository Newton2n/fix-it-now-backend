import { Router } from "express";
import { bookingController } from "./booking.controller";
import { authMiddleware } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { validate } from "../../middleware/validate";
const categoryRoute = Router();

//create booking
categoryRoute.post(
  "/",
  authMiddleware.auth(UserRole.CUSTOMER),
  bookingController.create,
);
//get all booking by log in customer
categoryRoute.get(
  "/",
  authMiddleware.auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.TECHNICIAN),
  bookingController.getAll,
);
//get booking details
categoryRoute.patch(
  "/:id",
  authMiddleware.auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.CUSTOMER),
  bookingController.getDetails,
);
//update service by technician
categoryRoute.patch(
  "/:id",
  authMiddleware.auth(UserRole.TECHNICIAN),
  bookingController.update,
);

export default categoryRoute;
