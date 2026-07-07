import { Router } from "express";
import { serviceController } from "./service.controller";
import { authMiddleware } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { validate } from "../../middleware/validate";
import { createServiceSchema } from "./service.schema";
const serviceRoute = Router();

//get all service
serviceRoute.get("/", serviceController.getAll);

//get single service details
serviceRoute.get(
  "/:id",
  authMiddleware.auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.TECHNICIAN),
  serviceController.getById,
);
//Create service
serviceRoute.post(
  "/",
  authMiddleware.auth(UserRole.TECHNICIAN),
    validate(createServiceSchema),
  serviceController.create,
);

// update service
serviceRoute.patch(
  "/:id",
  authMiddleware.auth(UserRole.TECHNICIAN),
  //   validate(updateCategorySchema),
  serviceController.update,
);

//delete service
serviceRoute.delete(
  "/:id",
  authMiddleware.auth(UserRole.TECHNICIAN),
  serviceController.update,
);

export default serviceRoute;
