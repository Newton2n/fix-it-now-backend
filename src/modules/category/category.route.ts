import { Router } from "express";

const categoryRoute = Router();

//get all route
categoryRoute.get("/");
//create category
categoryRoute.post("/");
//update category
categoryRoute.patch("/:id");
//delete category
categoryRoute.delete("/:id");

export default categoryRoute;
