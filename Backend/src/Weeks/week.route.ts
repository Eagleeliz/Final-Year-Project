import {Router } from "express";
import {
  getWeeklyCheckinsController,
  getWeeklyCheckinByIdController,
  getWeeklyCheckinsForPregnancyController,
  getWeeklyCheckinByWeekController,
  createWeeklyCheckinController,
  updateWeeklyCheckinController,
  deleteWeeklyCheckinController,
  getWeeklySummaryController
} from "./week.controller.js";

const weekRouter = Router();

// ========== GET ROUTES ==========
// GET /api/weeks - Get all weekly check-ins
weekRouter.get("/", getWeeklyCheckinsController);

// GET /api/weeks/summary/:pregnancyId - Get weekly summary for pregnancy
weekRouter.get("/summary/:pregnancyId", getWeeklySummaryController);

// GET /api/weeks/pregnancy/:pregnancyId - Get check-ins for a pregnancy
weekRouter.get("/pregnancy/:pregnancyId", getWeeklyCheckinsForPregnancyController);

// GET /api/weeks/week/:pregnancyId/:weekNumber - Get check-in by pregnancy and week
weekRouter.get("/week/:pregnancyId/:weekNumber", getWeeklyCheckinByWeekController);

// GET /api/weeks/:id - Get single check-in by ID
weekRouter.get("/:id", getWeeklyCheckinByIdController);

// ========== POST ROUTES ==========
// POST /api/weeks - Create new weekly check-in
weekRouter.post("/", createWeeklyCheckinController);

// ========== PUT ROUTES ==========
// PUT /api/weeks/:id - Update weekly check-in
weekRouter.put("/:id", updateWeeklyCheckinController);

// ========== DELETE ROUTES ==========
// DELETE /api/weeks/:id - Delete weekly check-in
weekRouter.delete("/:id", deleteWeeklyCheckinController);

export default weekRouter;