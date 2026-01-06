import { Router } from "express";
import * as PregnancyController from "./pregnancy.controller";

const pregnancyRouter = Router();

// Create a pregnancy
pregnancyRouter.post("/", PregnancyController.createPregnancy);

// Get all pregnancies for a user
pregnancyRouter.get("/user/:userId", PregnancyController.getPregnanciesByUser);

// Get a single pregnancy by ID
pregnancyRouter.get("/:id", PregnancyController.getPregnancyById);

// Update a pregnancy
pregnancyRouter.put("/:id", PregnancyController.updatePregnancy);

// Delete a pregnancy
pregnancyRouter.delete("/:id", PregnancyController.deletePregnancy);

export default pregnancyRouter;
