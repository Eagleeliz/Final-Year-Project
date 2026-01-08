import { Router } from "express";
import {
  seedGuidanceController,
  getAllGuidanceController,
  getGuidanceByWeekController,
} from "./guidance.controller";

const guidanceRouter = Router();



// ⚠️ Run ONCE (admin / dev only)
guidanceRouter.post("/seedi", seedGuidanceController);

// Get all pregnancy guidance (Week 1–40)
guidanceRouter.get("/week/all", getAllGuidanceController);



// Get guidance for a specific week
guidanceRouter.get("/week/:weekNumber", getGuidanceByWeekController);

export default guidanceRouter;
