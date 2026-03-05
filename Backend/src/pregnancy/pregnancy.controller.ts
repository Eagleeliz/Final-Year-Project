import { Request, Response } from "express";
import * as PregnancyService from "./pregnancy.service";

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

/**
 * NEW: Specifically for the User Dashboard
 */
export const getActivePregnancy = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ success: false, message: "Invalid userId" });

    const pregnancy = await PregnancyService.getActivePregnancyByUserId(userId);

    if (!pregnancy) {
      return res.status(200).json({
        success: true,
        hasActivePregnancy: false,
        message: "No active pregnancy found"
      });
    }

    res.json({
      success: true,
      hasActivePregnancy: true,
      data: pregnancy
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllPregnancies = async (_req: Request, res: Response) => {
  try {
    const pregnancies = await PregnancyService.getAllPregnancies();
    res.json({ success: true, count: pregnancies.length, data: pregnancies });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch pregnancies" });
  }
};

export const getPregnanciesByUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ success: false, message: "Invalid userId" });

    const pregnancies = await PregnancyService.getPregnanciesByUserId(userId);
    res.json({ success: true, count: pregnancies.length, data: pregnancies });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch pregnancies" });
  }
};

export const getPregnancyById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const pregnancy = await PregnancyService.getPregnancyById(id);
    if (!pregnancy) return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, data: pregnancy });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error" });
  }
};

export const updatePregnancy = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const pregnancy = await PregnancyService.updatePregnancy(id, req.body);
    res.json({ success: true, message: "Updated successfully 😎", data: pregnancy });
  } catch (error) {
    res.status(400).json({ success: false, message: "Update failed" });
  }
};

export const deletePregnancy = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await PregnancyService.deletePregnancy(id);
    res.json({ success: true, message: "Deleted successfully 😎" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};