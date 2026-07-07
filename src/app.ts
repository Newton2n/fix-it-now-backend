import cookieParser from "cookie-parser";
import express, { Application } from "express";
import cors from "cors";
import authRoute from "./modules/auth/auth.route";
import categoryRoute from "./modules/category/category.route";
import globalError from "./middleware/global-error";
import notFound from "./middleware/not-found";
const app: Application = express();


app.use(cors());



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/technicians", categoryRoute);


// error handle
app.use(notFound);
app.use(globalError);


export default app;