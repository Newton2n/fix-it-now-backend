import { Router } from "express";
import { categoryController } from "./category.controller";
import { authMiddleware } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { validate } from "../../middleware/validate";
import { createCategorySchema, updateCategorySchema } from "./category.schema";
const reviewRoute = Router();

//create review
reviewRoute.get("/", reviewController.create);

//get review by id review
reviewRoute.get("/:id", reviewController.getById);

//update review by owner
reviewRoute.patch("/:id", reviewController.update);

//delete review by owner
reviewRoute.delete("/:id", reviewController.remove);

//get all reviews log in customer
reviewRoute.get("/me", reviewController.getAllByCustomer);
