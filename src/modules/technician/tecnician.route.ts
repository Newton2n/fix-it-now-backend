import { Router } from "express";
import { technicianController } from "./technician.controller";
import { authMiddleware } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
const categoryRoute = Router();

categoryRoute.post("/profile", technicianController.create);
categoryRoute.patch("/profile", technicianController.updateProfile);
categoryRoute.patch("/availability", technicianController.updateAvailability);
categoryRoute.get("/me", technicianController.getMe);
categoryRoute.get("/bookings", technicianController.getBookings);

export default categoryRoute;
