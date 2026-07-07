import { Router } from "express";
import { authController } from "./auth.controller";

const authRouter = Router();

//register user
authRouter.post("/register", authController.register);

//login
authRouter.post("/login", authController.login);

//get me

authRouter.post("/me", authController.register);


//refresh token

authRouter.post("/refresh-token", authController.refreshToken);

export default authRouter;
