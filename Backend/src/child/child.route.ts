import { Router } from "express";
import {
  createChildController,
  getChildrenByUserController,
  getChildByIdController,
  updateChildController,
  deleteChildController,
} from "./child.controller";
import { motherOnly } from "../middlewares/bearAuth";

const childRouter = Router();

// POST   /api/children              — register a new child
childRouter.post("/", motherOnly, createChildController);

// GET    /api/children/user/:userId — get all children for a user
childRouter.get("/user/:userId", motherOnly, getChildrenByUserController);

// GET    /api/children/:id          — get single child by id
childRouter.get("/:id", motherOnly, getChildByIdController);

// PUT    /api/children/:id          — update child details
childRouter.put("/:id", motherOnly, updateChildController);

// DELETE /api/children/:id          — delete a child record
childRouter.delete("/:id", motherOnly, deleteChildController);

export default childRouter;