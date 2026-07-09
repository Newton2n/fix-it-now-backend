import { Router } from "express";
import { userController } from "./user.controller";
import { validate } from "../../middleware/validate";

import { authMiddleware } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { userUpdatePassword, userUpdateSchema } from "./user.schema";

const userRoute = Router();

//update user
userRoute.patch(
  "/update",
  authMiddleware.auth(UserRole.ADMIN,UserRole.CUSTOMER,UserRole.TECHNICIAN),
  validate(userUpdateSchema),
  userController.update,
);
//update user
userRoute.patch(
  "/update-password",
  authMiddleware.auth(UserRole.ADMIN,UserRole.CUSTOMER,UserRole.TECHNICIAN),
  validate(userUpdatePassword),
  userController.updatePassword,
);




export default userRoute;
