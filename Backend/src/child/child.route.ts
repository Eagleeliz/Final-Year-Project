import { Router } from "express";
import {
  createChildController,
  getChildrenByUserController,
  getChildByIdController,
  updateChildController,
  deleteChildController,
  createMilestoneController,
  getMilestonesByChildController,
  updateMilestoneController,
  deleteMilestoneController,
} from "./child.controller";
import { motherOnly } from "../middlewares/bearAuth";

const childRouter = Router();

// ── Child routes ──────────────────────────────────────────────

// POST   /api/children                   — register a new child
childRouter.post("/", motherOnly, createChildController);

// GET    /api/children/user/:userId      — all children for a user
childRouter.get("/user/:userId", motherOnly, getChildrenByUserController);

// GET    /api/children/:id               — single child by id
childRouter.get("/:id", motherOnly, getChildByIdController);

// PUT    /api/children/:id               — update child details
childRouter.put("/:id", motherOnly, updateChildController);

// DELETE /api/children/:id               — delete a child
childRouter.delete("/:id", motherOnly, deleteChildController);

// ── Milestone routes ──────────────────────────────────────────

// POST   /api/children/:id/milestones               — add a milestone
childRouter.post("/:id/milestones", motherOnly, createMilestoneController);

// GET    /api/children/:id/milestones               — get all milestones for child
childRouter.get("/:id/milestones", motherOnly, getMilestonesByChildController);

// PUT    /api/children/:id/milestones/:milestoneId  — update a milestone
childRouter.put("/:id/milestones/:milestoneId", motherOnly, updateMilestoneController);

// DELETE /api/children/:id/milestones/:milestoneId  — delete a milestone
childRouter.delete("/:id/milestones/:milestoneId", motherOnly, deleteMilestoneController);

export default childRouter;