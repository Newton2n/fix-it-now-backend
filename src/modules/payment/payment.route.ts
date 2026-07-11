import { Router } from "express";
import { paymentController } from "./payment.controller";
import { authMiddleware } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { validate, validateQuery } from "../../middleware/validate";
import { createSession, UserPaymentSearchSchema } from "./payment.schema";
const paymentRoute = Router();

//checkout link
paymentRoute.post(
  "/checkout",
  authMiddleware.auth(UserRole.CUSTOMER),
  validate(createSession),
  paymentController.checkout,
);

//webhook handler
paymentRoute.post("/webhook", paymentController.webhookHandler);

//response 
paymentRoute.get("/payment-response", paymentController.response);

//get all payment by login user
paymentRoute.get(
  "/",
  authMiddleware.auth(UserRole.CUSTOMER),
  validateQuery( UserPaymentSearchSchema),
  paymentController.getAllByLogInUser,
);

// get payment by id 
paymentRoute.get(
  "/:paymentId",
  authMiddleware.auth(UserRole.CUSTOMER),
  paymentController.getById,
);

export default paymentRoute;
