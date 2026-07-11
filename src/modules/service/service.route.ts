import { Router } from "express";
import { serviceController } from "./service.controller";
import { authMiddleware } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { validate, validateQuery } from "../../middleware/validate";
import {
  createServiceSchema,
  ServiceSearchFiltersSchema,
  updateServiceSchema,
} from "./service.schema";
const serviceRoute = Router();

//get all service
serviceRoute.get(
  "/",
  validateQuery(ServiceSearchFiltersSchema),
  serviceController.getAll,
);

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
  validate(updateServiceSchema),
  serviceController.update,
);

//delete service
serviceRoute.delete(
  "/:id",
  authMiddleware.auth(UserRole.TECHNICIAN),
  serviceController.remove,
);
//get all services by technician id
serviceRoute.get(
  "/:id/technician",
  authMiddleware.auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.CUSTOMER),
  serviceController.getAllByTechnicianId,
);

// get all reviews for a service
serviceRoute.get("/:serviceId/reviews", serviceController.getAllReviews);
export default serviceRoute;
