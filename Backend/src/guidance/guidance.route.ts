import { Router } from "express";
import {
  seedGuidanceController,
  getAllGuidanceController,
  getGuidanceByWeekController,
  createGuidanceController,
  updateGuidanceController,
  deleteGuidanceController,
} from "./guidance.controller";

const guidanceRouter = Router();

// Run ONCE — seed all 40 weeks
guidanceRouter.post("/seedi", seedGuidanceController);

// GET all weeks 1–40
guidanceRouter.get("/week/all", getAllGuidanceController);

// GET specific week
guidanceRouter.get("/week/:weekNumber", getGuidanceByWeekController);

// POST — create new guidance (admin)
guidanceRouter.post("/", createGuidanceController);

// PUT — update guidance by id (admin)
guidanceRouter.put("/:id", updateGuidanceController);

// DELETE — delete guidance by id (admin)
guidanceRouter.delete("/:id", deleteGuidanceController);

export default guidanceRouter;