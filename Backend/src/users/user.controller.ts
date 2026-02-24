import {Request,response,Response} from "express";
  import {
  createUserServices,
  updateUserService,
  deleteUserService,
  getUserByIdService,
  getAllUsersService,
} from "./user.service";


//create user controller

export const createUserController = async (req: Request, res: Response) => {
  try {
    const result = await createUserServices(req.body);

    // Check if result is the conflict object
    if (typeof result === "object" && "conflict" in result) {
      const conflictMessage =
        result.conflict === "email"
          ? "Email already exists"
          : "Phone number already exists";

      return res.status(409).json({ message: conflictMessage });
    }

    // Success
    return res.status(201).json({ message: result });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      message: "Failed to create user",
      error: error?.message || error,
    });
  }
};


//update user controller
export const updateUserController = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const updatedData = req.body;

    const result = await updateUserService(userId, updatedData);

    if (!result) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({
      message: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update user",
      error,
    });
  }
};
//delete user controller
export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    const result = await deleteUserService(userId);

    if (!result) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({
      message: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete user",
      error,
    });
  }
};


//get user by id
export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    const user = await getUserByIdService(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch user",
      error,
    });
  }
};

//get all users

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();

    return res.json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch users",
      error,
    });
  }
};


