import { Router } from "express";
import { askAIController } from "../groqai/groq.controller";

const aiRouter = Router();

// Only one endpoint
aiRouter.post("/ask", askAIController);

export default aiRouter;