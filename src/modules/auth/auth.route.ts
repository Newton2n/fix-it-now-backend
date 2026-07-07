import { Router } from "express";
import { authController } from "./auth.controller";
import { validate } from "../../middleware/validate";
import { userLoginSchema, userRegisterSchema } from "./auth.schema";

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

authRoute.post("/me", authController.register);

//refresh token

authRoute.post("/refresh-token", authController.refreshToken);

export default authRoute;
