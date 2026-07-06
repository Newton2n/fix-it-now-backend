import { Router } from "express";
import { authController } from "./auth.controller";

const authRouter = Router();

//register user
authRouter.post("/register",authController.register)





export default authRouter

