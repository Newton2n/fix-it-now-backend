import { Router } from "express";
import { authController } from "./auth.controller";
import { validate } from "../../middleware/validate";
import { userLoginSchema, userRegisterSchema } from "./auth.schema";

const authRouter = Router();

//register user
authRouter.post(
  "/register",
  validate(userRegisterSchema),
  authController.register,
);

//login
authRouter.post("/login", validate(userLoginSchema), authController.login);

//get me

authRouter.post("/me", authController.register);

//refresh token

authRouter.post("/refresh-token", authController.refreshToken);

export default authRouter;
