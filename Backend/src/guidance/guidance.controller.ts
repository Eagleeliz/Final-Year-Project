import { Request, Response } from "express";
import {
  seedGuidance,
  getAllGuidance,
  getGuidanceByWeek,
} from "./guidance.service";

// Seed pregnancy guidance (run once / admin use)
export const seedGuidanceController = async (
  req: Request,
  res: Response
) => {
  try {
    const message = await seedGuidance();
    res.status(201).json({
      success: true,
      message,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to seed pregnancy guidance",
      error: error.message,
    });
  }
};

// Get guidance for all weeks (Week 1–40)
export const getAllGuidanceController = async (
  req: Request,
  res: Response
) => {
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

// Get guidance for a specific week
export const getGuidanceByWeekController = async (
  req: Request,
  res: Response
) => {
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

    res.status(200).json({
      success: true,
      data: guidance,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch weekly guidance",
      error: error.message,
    });
  }
};
