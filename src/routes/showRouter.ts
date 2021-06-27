import express from "express";
import { ShowController } from "../controller/ShowController";

export const showRouter = express.Router();

const showController = new ShowController();

showRouter.post("/show", showController.createShow);
showRouter.get("/by-weekday", showController.getShowByDay)