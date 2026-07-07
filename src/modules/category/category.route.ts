import { Router } from "express";
import { categoryController } from "./category.controller";
import { authMiddleware } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
const categoryRoute = Router();

//get all route
categoryRoute.get("/", categoryController.getAll);
//create category
categoryRoute.post(
  "/",
  authMiddleware.auth(UserRole.ADMIN),
  categoryController.create,
);
//update category
categoryRoute.patch(
  "/:id",
  authMiddleware.auth(UserRole.ADMIN),
  categoryController.update,
);
//delete category
categoryRoute.delete(
  "/:id",
  authMiddleware.auth(UserRole.ADMIN),
  categoryController.remove,
);

export default categoryRoute;
