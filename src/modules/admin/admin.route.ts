import { Router } from "express";
import { adminController } from "./admin.controller";
import { authMiddleware } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { validate } from "../../middleware/validate";
import { updateUserStatus } from "./admin.schema";
const adminRoute = Router();

//get all user
adminRoute.get(
  "/users",
  authMiddleware.auth(UserRole.ADMIN),
  adminController.getAllUser,
);

//Update user status
adminRoute.patch(
  "/users/:id",
  authMiddleware.auth(UserRole.ADMIN),
  validate(updateUserStatus),
  adminController.updateUserStatus,
);

//Get all bookings
adminRoute.get(
  "/bookings",
  authMiddleware.auth(UserRole.ADMIN),
  adminController.getAllBooking,
);

//get all category
adminRoute.get(
  "/categories",
  authMiddleware.auth(UserRole.ADMIN),
  adminController.getAllCategory,
);

//get all reviews
adminRoute.get(
  "/reviews",
  authMiddleware.auth(UserRole.ADMIN),
  adminController.getAllReviews,
);


export default adminRoute