import cookieParser from "cookie-parser";
import express, { Application } from "express";
import cors from "cors";
import authRoute from "./modules/auth/auth.route";
import categoryRoute from "./modules/category/category.route";
import globalError from "./middleware/global-error";
import notFound from "./middleware/not-found";
import technicianRoute from "./modules/technician/tecnician.route";
import serviceRoute from "./modules/service/service.route";
import bookingRoute from "./modules/booking/booking.route";
import reviewRoute from "./modules/review/review.route";
import adminRoute from "./modules/admin/admin.route";
import paymentRoute from "./modules/payment/payment.route";
import userRoute from "./modules/user/user.route";
const app: Application = express();

//accept all req
app.use(cors());

//special webhook middleware
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//al route
app.use("/api/auth", authRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/technicians", technicianRoute);
app.use("/api/service", serviceRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/review", reviewRoute);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/payment",paymentRoute);


// error handle
app.use(notFound);
app.use(globalError);


export default app;