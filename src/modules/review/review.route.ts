import { Router } from "express";
import { reviewController } from "./review.controller";
import { authMiddleware } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { validate, validateQuery } from "../../middleware/validate";
import { createReviewSchema, updateReviewSchema, UserReviewSearchSchema } from "./review.schema";

const reviewRoute = Router();

//create review
reviewRoute.post(
  "/",
  authMiddleware.auth(UserRole.CUSTOMER),
  validate(createReviewSchema),
  reviewController.create,
);
//create review
reviewRoute.get(
  "/latest",
  reviewController.getLatest,
);

//get all reviews log in customer
reviewRoute.get("/me",authMiddleware.auth(UserRole.CUSTOMER,UserRole.ADMIN,UserRole.TECHNICIAN),validateQuery(UserReviewSearchSchema), reviewController.getAllByMe);
//get review by booking id
reviewRoute.get("/:bookingId", reviewController.getByBookingId);

//update review by owner
reviewRoute.patch("/:reviewId", authMiddleware.auth(UserRole.CUSTOMER),
  validate(updateReviewSchema), reviewController.update);

//delete review by owner
reviewRoute.delete("/:id",authMiddleware.auth(UserRole.CUSTOMER,UserRole.ADMIN), reviewController.remove);


export default reviewRoute;
