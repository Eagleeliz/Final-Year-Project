import { Request, Response } from "express";
import {
  createChild,
  getChildrenByUser,
  getChildById,
  updateChild,
  deleteChild,
} from "./child.service";

// POST /api/children
export const createChildController = async (req: Request, res: Response) => {
  try {
    const child = await createChild(req.body);
    res.status(201).json({ success: true, data: child });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to create child", error: error.message });
  }
};

// GET /api/children/user/:userId
export const getChildrenByUserController = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
      res.status(400).json({ success: false, message: "Invalid user ID" });
      return;
    }
    const children = await getChildrenByUser(userId);
    res.status(200).json({ success: true, count: children.length, data: children });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to fetch children", error: error.message });
  }
};

// GET /api/children/:id
export const getChildByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid child ID" });
      return;
    }
    const child = await getChildById(id);
    if (!child) {
      res.status(404).json({ success: false, message: "Child not found" });
      return;
    }
    res.status(200).json({ success: true, data: child });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to fetch child", error: error.message });
  }
};

// PUT /api/children/:id
export const updateChildController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid child ID" });
      return;
    }
    const updated = await updateChild(id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: "Child not found" });
      return;
    }
    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to update child", error: error.message });
  }
};

// DELETE /api/children/:id
export const deleteChildController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid child ID" });
      return;
    }
    await deleteChild(id);
    res.status(200).json({ success: true, message: "Child deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to delete child", error: error.message });
  }
};