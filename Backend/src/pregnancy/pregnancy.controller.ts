import { Request, Response } from "express";
import * as PregnancyService from "./pregnancy.service";

// Create a pregnancy
export const createPregnancy = async (req: Request, res: Response) => {
  try {
    const pregnancy = await PregnancyService.createPregnancy(req.body);

    res.status(201).json({
      success: true,
      message: "Pregnancy record created successfully 😎",
      data: pregnancy
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create pregnancy"
    });
  }
};

// ✅ Get ALL pregnancies (system-wide)
export const getAllPregnancies = async (_req: Request, res: Response) => {
  try {
    const pregnancies = await PregnancyService.getAllPregnancies();

    res.json({
      success: true,
      count: pregnancies.length,
      data: pregnancies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pregnancies"
    });
  }
};

// Get all pregnancies for a specific user
export const getPregnanciesByUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId"
      });
    }

    const pregnancies = await PregnancyService.getPregnanciesByUserId(userId);

    res.json({
      success: true,
      count: pregnancies.length,
      data: pregnancies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pregnancies"
    });
  }
};

// Get a single pregnancy by ID
export const getPregnancyById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pregnancy id"
      });
    }

    const pregnancy = await PregnancyService.getPregnancyById(id);

    if (!pregnancy) {
      return res.status(404).json({
        success: false,
        message: "Pregnancy not found"
      });
    }

    res.json({
      success: true,
      data: pregnancy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pregnancy"
    });
  }
};

// Update a pregnancy
export const updatePregnancy = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pregnancy id"
      });
    }

    const pregnancy = await PregnancyService.updatePregnancy(id, req.body);

    if (!pregnancy) {
      return res.status(404).json({
        success: false,
        message: "Pregnancy not found"
      });
    }

    res.json({
      success: true,
      message: "Pregnancy record updated successfully 😎",
      data: pregnancy
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update pregnancy"
    });
  }
};

// Delete a pregnancy
export const deletePregnancy = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pregnancy id"
      });
    }

    await PregnancyService.deletePregnancy(id);

    res.json({
      success: true,
      message: "Pregnancy record deleted successfully 😎"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete pregnancy"
    });
  }
};
