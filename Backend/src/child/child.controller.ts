import { Request, Response } from "express";
import {
  createChild,
  getChildrenByUser,
  getChildById,
  updateChild,
  deleteChild,
  createMilestone,
  getMilestonesByChild,
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
} from "./child.service";

// Child controllers

// Create a new child
export const createChildController = async (req: Request, res: Response) => {
  try {
    const child = await createChild(req.body);
    res.status(201).json({ success: true, data: child });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to create child", error: error.message });
  }
};

// Get all children for a user
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

// Get a child by ID
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

// Update a child
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

// Delete a child
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

// Milestone controllers

// Create a milestone for a child
export const createMilestoneController = async (req: Request, res: Response) => {
  try {
    const childId = Number(req.params.id);
    if (isNaN(childId)) {
      res.status(400).json({ success: false, message: "Invalid child ID" });
      return;
    }
    const milestone = await createMilestone({ ...req.body, childId });
    res.status(201).json({ success: true, data: milestone });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to create milestone", error: error.message });
  }
};

// Get all milestones for a child
export const getMilestonesByChildController = async (req: Request, res: Response) => {
  try {
    const childId = Number(req.params.id);
    if (isNaN(childId)) {
      res.status(400).json({ success: false, message: "Invalid child ID" });
      return;
    }
    const milestones = await getMilestonesByChild(childId);
    res.status(200).json({ success: true, count: milestones.length, data: milestones });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to fetch milestones", error: error.message });
  }
};

// Update a milestone
export const updateMilestoneController = async (req: Request, res: Response) => {
  try {
    const milestoneId = Number(req.params.milestoneId);
    if (isNaN(milestoneId)) {
      res.status(400).json({ success: false, message: "Invalid milestone ID" });
      return;
    }
    const existing = await getMilestoneById(milestoneId);
    if (!existing) {
      res.status(404).json({ success: false, message: "Milestone not found" });
      return;
    }
    const updated = await updateMilestone(milestoneId, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to update milestone", error: error.message });
  }
};

// Delete a milestone
export const deleteMilestoneController = async (req: Request, res: Response) => {
  try {
    const milestoneId = Number(req.params.milestoneId);
    if (isNaN(milestoneId)) {
      res.status(400).json({ success: false, message: "Invalid milestone ID" });
      return;
    }
    const existing = await getMilestoneById(milestoneId);
    if (!existing) {
      res.status(404).json({ success: false, message: "Milestone not found" });
      return;
    }
    await deleteMilestone(milestoneId);
    res.status(200).json({ success: true, message: "Milestone deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to delete milestone", error: error.message });
  }
};