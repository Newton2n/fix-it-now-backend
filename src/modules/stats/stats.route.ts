import { Router } from "express";
import { statsController } from "./stats.controller";
import { authMiddleware } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const statsRoute = Router();

//get whole app stats
statsRoute.get("/summary", statsController.getAll);
statsRoute.get("/admin",  authMiddleware.auth(UserRole.ADMIN),
     statsController.admin);
statsRoute.get("/customer",  authMiddleware.auth(UserRole.CUSTOMER),
     statsController.customer);
statsRoute.get("/technician",  authMiddleware.auth(UserRole.TECHNICIAN),
     statsController.technician);

export default statsRoute;
