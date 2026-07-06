import cookieParser from "cookie-parser";
import express, { Application } from "express";
import cors from "cors";
import authRouter from "./modules/auth/auth.route";
const app: Application = express();


app.use(cors());



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);



export default app;