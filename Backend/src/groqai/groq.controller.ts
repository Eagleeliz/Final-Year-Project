import { Request, Response } from "express";
import { getGroqAdvice } from "../groqai/groq.service";

export const askAIController = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    // Check if question exists
    if (!question || typeof question !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Question is required"
      });
    }

    // Get AI response
    const answer = await getGroqAdvice(question);

    // Return success
    return res.status(200).json({
      success: true,
      answer: answer
    });

  } catch (error: any) {
    console.error("Controller error:", error.message);
    
    return res.status(500).json({
      success: false,
      message: "Failed to get AI response"
    });
  }
};