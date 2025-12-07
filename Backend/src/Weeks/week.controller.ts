import { Request, Response } from "express";
import {
  getWeeklyCheckinsService,
  getWeeklyCheckinByIdService,
  getWeeklyCheckinsForPregnancyService,
  getWeeklyCheckinByWeekService,
  createWeeklyCheckinService,
  updateWeeklyCheckinService,
  deleteWeeklyCheckinService,
  getWeeklySummaryService
} from "./week.service.js";

// Get all weekly check-ins
export const getWeeklyCheckinsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const checkins = await getWeeklyCheckinsService();
    
    if (!checkins) {
      res.status(404).json({
        success: false,
        message: "No weekly check-ins found"
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      count: checkins.length,
      data: checkins
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get weekly check-in by ID
export const getWeeklyCheckinByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid check-in ID"
      });
      return;
    }
    
    const checkin = await getWeeklyCheckinByIdService(id);
    
    if (!checkin) {
      res.status(404).json({
        success: false,
        message: "Weekly check-in not found"
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: checkin
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get weekly check-ins for a pregnancy
export const getWeeklyCheckinsForPregnancyController = async (req: Request, res: Response): Promise<void> => {
  try {
    const pregnancyId = parseInt(req.params.pregnancyId);
    
    if (isNaN(pregnancyId)) {
      res.status(400).json({
        success: false,
        message: "Invalid pregnancy ID"
      });
      return;
    }
    
    const checkins = await getWeeklyCheckinsForPregnancyService(pregnancyId);
    
    if (!checkins) {
      res.status(404).json({
        success: false,
        message: "No weekly check-ins found for this pregnancy"
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      count: checkins.length,
      data: checkins
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get weekly check-in by pregnancy and week number
export const getWeeklyCheckinByWeekController = async (req: Request, res: Response): Promise<void> => {
  try {
    const pregnancyId = parseInt(req.params.pregnancyId);
    const weekNumber = parseInt(req.params.weekNumber);
    
    if (isNaN(pregnancyId) || isNaN(weekNumber)) {
      res.status(400).json({
        success: false,
        message: "Invalid pregnancy ID or week number"
      });
      return;
    }
    
    const checkin = await getWeeklyCheckinByWeekService(pregnancyId, weekNumber);
    
    if (!checkin) {
      res.status(404).json({
        success: false,
        message: "Weekly check-in not found for this week"
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: checkin
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new weekly check-in
export const createWeeklyCheckinController = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    
    // Basic validation
    if (!data.pregnancyId || !data.weekNumber) {
      res.status(400).json({
        success: false,
        message: "pregnancyId and weekNumber are required"
      });
      return;
    }
    
    const checkin = await createWeeklyCheckinService(data);
    
    res.status(201).json({
      success: true,
      message: "Weekly check-in created successfully",
      data: checkin
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update weekly check-in
export const updateWeeklyCheckinController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid check-in ID"
      });
      return;
    }
    
    const updatedCheckin = await updateWeeklyCheckinService(id, data);
    
    if (!updatedCheckin) {
      res.status(404).json({
        success: false,
        message: "Weekly check-in not found"
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: "Weekly check-in updated successfully",
      data: updatedCheckin
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete weekly check-in
export const deleteWeeklyCheckinController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid check-in ID"
      });
      return;
    }
    
    const deletedCheckin = await deleteWeeklyCheckinService(id);
    
    if (!deletedCheckin) {
      res.status(404).json({
        success: false,
        message: "Weekly check-in not found"
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: "Weekly check-in deleted successfully",
      data: deletedCheckin
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get weekly summary for pregnancy
export const getWeeklySummaryController = async (req: Request, res: Response): Promise<void> => {
  try {
    const pregnancyId = parseInt(req.params.pregnancyId);
    
    if (isNaN(pregnancyId)) {
      res.status(400).json({
        success: false,
        message: "Invalid pregnancy ID"
      });
      return;
    }
    
    const summary = await getWeeklySummaryService(pregnancyId);
    
    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};