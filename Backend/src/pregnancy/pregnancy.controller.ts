import { Request, Response } from "express";
import * as PregnancyService from "./pregnancy.service";

// Create a pregnancy
export const createPregnancy = async (req: Request, res: Response) => {
  try {
    const pregnancy = await PregnancyService.createPregnancy(req.body);
    res.status(201).json({
      message: "Pregnancy record created successfully 😎",
      data: pregnancy
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create pregnancy", error });
  }
};

// Get all pregnancies for a user
export const getPregnanciesByUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const pregnancies = await PregnancyService.getPregnanciesByUserId(userId);
    res.json({
      message: `Found ${pregnancies.length} pregnancies for user ${userId}`,
      data: pregnancies
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pregnancies", error });
  }
};

// Get a single pregnancy by ID
export const getPregnancyById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const pregnancy = await PregnancyService.getPregnancyById(id);

    if (!pregnancy) {
      return res.status(404).json({ message: "Pregnancy not found" });
    }

    res.json({
      message: "Pregnancy record fetched successfully",
      data: pregnancy
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pregnancy", error });
  }
};

// Update a pregnancy
export const updatePregnancy = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const pregnancy = await PregnancyService.updatePregnancy(id, req.body);

    if (!pregnancy) {
      return res.status(404).json({ message: "Pregnancy not found" });
    }

    res.json({
      message: "Pregnancy record updated successfully 😎",
      data: pregnancy
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update pregnancy", error });
  }
};

// Delete a pregnancy
export const deletePregnancy = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await PregnancyService.deletePregnancy(id);

    res.json({
      message: "Pregnancy record deleted successfully 😎",
      data: result
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete pregnancy", error });
  }
};
