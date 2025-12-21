import { Router } from "express";
import {
  createUserController,
  updateUserController,
  deleteUserController,
  getUserByIdController,
  getAllUsersController,
} from "./user.controller";

const userRouter = Router();

// All routes relative to /api/users
userRouter.get("/", getAllUsersController);
userRouter.post("/", createUserController);
userRouter.get("/:id", getUserByIdController);
userRouter.put("/:id", updateUserController);
userRouter.delete("/:id", deleteUserController);

export default userRouter;
