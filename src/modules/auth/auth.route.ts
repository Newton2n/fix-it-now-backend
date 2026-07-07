import { Router } from "express";
import { authController } from "./auth.controller";
import { validate } from "../../middleware/validate";
import { userLoginSchema, userRegisterSchema } from "./auth.schema";
import { authMiddleware } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const authRoute = Router();

//register user
authRoute.post(
  "/register",
  validate(userRegisterSchema),
  authController.register,
);

//login
authRoute.post("/login", validate(userLoginSchema), authController.login);

//get me

authRoute.get(
  "/me",
  authMiddleware.auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.TECHNICIAN),
  authController.getMe,
);

//refresh token

authRoute.post("/refresh-token", authController.refreshToken);

export default authRoute;
