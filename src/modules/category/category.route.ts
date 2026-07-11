import { Router } from "express";
import { categoryController } from "./category.controller";
import { authMiddleware } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { validate, validateQuery } from "../../middleware/validate";
import { CategorySearchSchema, createCategorySchema, updateCategorySchema } from "./category.schema";
const categoryRoute = Router();

//get all
categoryRoute.get("/",validateQuery(CategorySearchSchema), categoryController.getAll);
//create category
categoryRoute.post(
  "/admin",
  authMiddleware.auth(UserRole.ADMIN),
  validate(createCategorySchema),
  categoryController.create,
);
//update category
categoryRoute.patch(
  "/admin/:id",
  authMiddleware.auth(UserRole.ADMIN),
  validate(updateCategorySchema),
  categoryController.update,
);
//delete category
categoryRoute.delete(
  "/admin/:id",
  authMiddleware.auth(UserRole.ADMIN),
  categoryController.remove,
);

export default categoryRoute;
