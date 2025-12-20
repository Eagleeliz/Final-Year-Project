import { Router } from "express";
import {
  createUserController,
  updateUserController,
  deleteUserController,
  getUserByIdController,
  getAllUsersController,
} from "./user.controller";

const userRouter = Router();
userRouter.get("/user", getAllUsersController);
userRouter.post("/user", createUserController);
userRouter.get("/user/:id", getUserByIdController);
userRouter.put("/user/:id", updateUserController);
userRouter.delete("/user/:id", deleteUserController);


export default userRouter;
