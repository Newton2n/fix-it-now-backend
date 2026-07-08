import { Router } from "express";
import { reviewController } from "./review.controller";
import { authMiddleware } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { validate } from "../../middleware/validate";
import { createReviewSchema, updateReviewSchema } from "./review.schema";

const reviewRoute = Router();

//create review
reviewRoute.post(
  "/",
  authMiddleware.auth(UserRole.CUSTOMER),
  validate(createReviewSchema),
  reviewController.create,
);

//get review by id review
reviewRoute.get("/:id", reviewController.getById);

//update review by owner
reviewRoute.patch("/:id", authMiddleware.auth(UserRole.CUSTOMER),
  validate(updateReviewSchema), reviewController.update);

//delete review by owner
reviewRoute.delete("/:id",authMiddleware.auth(UserRole.CUSTOMER,UserRole.ADMIN), reviewController.remove);

//get all reviews log in customer
reviewRoute.get("/me",authMiddleware.auth(UserRole.CUSTOMER,UserRole.ADMIN,UserRole.TECHNICIAN), reviewController.getAllByMe);

export default reviewRoute;
