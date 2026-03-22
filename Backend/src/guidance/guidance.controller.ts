import { Request, Response } from "express";
import {
  seedGuidance,
  getAllGuidance,
  getGuidanceByWeek,
  createGuidance,
  updateGuidance,
  deleteGuidance,
} from "./guidance.service";

// POST /api/guidance/seedi — run once
export const seedGuidanceController = async (req: Request, res: Response) => {
  try {
    const message = await seedGuidance();
    res.status(201).json({ success: true, message });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to seed pregnancy guidance",
      error: error.message,
    });
  }
};

// GET /api/guidance/week/all
export const getAllGuidanceController = async (req: Request, res: Response) => {
  try {
    const guidance = await getAllGuidance();
    res.status(200).json({
      success: true,
      count: guidance.length,
      data: guidance,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pregnancy guidance",
      error: error.message,
    });
  }
};

// GET /api/guidance/week/:weekNumber
export const getGuidanceByWeekController = async (req: Request, res: Response) => {
  try {
    const weekNumber = Number(req.params.weekNumber);

    if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 40) {
      res.status(400).json({
        success: false,
        message: "Week number must be between 1 and 40",
      });
      return;
    }

    const guidance = await getGuidanceByWeek(weekNumber);

    if (!guidance) {
      res.status(404).json({
        success: false,
        message: `No guidance found for week ${weekNumber}`,
      });
      return;
    }

    res.status(200).json({ success: true, data: guidance });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch weekly guidance",
      error: error.message,
    });
  }
};

// POST /api/guidance
export const createGuidanceController = async (req: Request, res: Response) => {
  try {
    const { weekNumber, title, summary, tips, source, link } = req.body;

    if (!weekNumber || !title || !summary || !tips || !source) {
      res.status(400).json({
        success: false,
        message: "weekNumber, title, summary, tips and source are required",
      });
      return;
    }

    if (weekNumber < 1 || weekNumber > 40) {
      res.status(400).json({
        success: false,
        message: "Week number must be between 1 and 40",
      });
      return;
    }

    const guidance = await createGuidance({
      weekNumber,
      title,
      summary,
      tips,
      source,
      link,
    });
    res.status(201).json({ success: true, data: guidance });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create guidance",
      error: error.message,
    });
  }
};

// PUT /api/guidance/:id
export const updateGuidanceController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid guidance ID" });
      return;
    }

    const updated = await updateGuidance(id, req.body);

    if (!updated) {
      res.status(404).json({ success: false, message: "Guidance not found" });
      return;
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update guidance",
      error: error.message,
    });
  }
};

// DELETE /api/guidance/:id
export const deleteGuidanceController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid guidance ID" });
      return;
    }

    await deleteGuidance(id);
    res.status(200).json({
      success: true,
      message: "Guidance deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete guidance",
      error: error.message,
    });
  }
};