import { Router } from "express";
import { userController } from "./user.controller";
import { validate } from "../../middleware/validate";

import { authMiddleware } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { userSetPassword, userUpdatePassword, userUpdateSchema } from "./user.schema";

const userRoute = Router();

//update user
userRoute.patch(
  "/update",
  authMiddleware.auth(UserRole.ADMIN,UserRole.CUSTOMER,UserRole.TECHNICIAN),
  validate(userUpdateSchema),
  userController.update,
);
//get user by id
userRoute.get(
  "/:id",
  userController.getUser,
);
//update user
userRoute.patch(
  "/update-password",
  authMiddleware.auth(UserRole.ADMIN,UserRole.CUSTOMER,UserRole.TECHNICIAN),
  validate(userUpdatePassword),
  userController.updatePassword,
);
//update user
userRoute.patch(
  "/set-password",
  authMiddleware.auth(UserRole.CUSTOMER,UserRole.TECHNICIAN),
  validate(userSetPassword),
  userController.setPassword,
);




export default userRoute;
