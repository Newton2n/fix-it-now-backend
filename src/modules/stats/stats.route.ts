import { Router } from "express";
import { statsController } from "./stats.controller";



const statsRoute = Router();

//get whole app stats
statsRoute.get("/summary",statsController.getAll);


export default statsRoute;
