import { Router } from "express";
import {
  getNationalSummary,
  getRiskTrends,
  getStats,
  getCountyBreakdown,
  getUsersByLocation,
} from "./policyMakerController";

const dashboardRouter = Router();

// GET /api/dashboard/national-summary?county=X&constituency=Y&ward=Z
dashboardRouter.get("/national-summary", getNationalSummary);

// GET /api/dashboard/risk-trends?county=X&constituency=Y&ward=Z
dashboardRouter.get("/risk-trends", getRiskTrends);

// GET /api/dashboard/stats
dashboardRouter.get("/stats", getStats);

// GET /api/dashboard/county-breakdown
dashboardRouter.get("/county-breakdown", getCountyBreakdown);

// GET /api/dashboard/users-by-location?county=X&constituency=Y&ward=Z
dashboardRouter.get("/users-by-location", getUsersByLocation);

export default dashboardRouter;