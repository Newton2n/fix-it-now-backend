import { Router } from "express";
import { adminController } from "./admin.controller";
import { authMiddleware } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { validate, validateQuery } from "../../middleware/validate";
import { BookingSearchSchema, ReviewSearchSchema, updateUserStatus, UserSearchSchema } from "./admin.schema";
import { CategorySearchSchema } from "../category/category.schema";
const adminRoute = Router();

//get all user
adminRoute.get(
  "/users",
  authMiddleware.auth(UserRole.ADMIN),
  validateQuery(UserSearchSchema),
  adminController.findUser,
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
  validateQuery(BookingSearchSchema),
  adminController.findBooking,
);

//get all category
adminRoute.get(
  "/categories",
  authMiddleware.auth(UserRole.ADMIN),
  validateQuery(CategorySearchSchema),
  adminController.findCategory,
);

//get all reviews
adminRoute.get(
  "/reviews",
  authMiddleware.auth(UserRole.ADMIN),
  validateQuery(ReviewSearchSchema),
  adminController.findReviews,
);


export default adminRoute