import { Router } from "express";
import * as PregnancyController from "./pregnancy.controller";

const pregnancyRouter = Router();

// ================= CREATE =================
// POST /api/pregnancies
pregnancyRouter.post("/", PregnancyController.createPregnancy);

// ================= READ =================
// GET /api/pregnancies → get ALL pregnancies (admin/system)
pregnancyRouter.get("/", PregnancyController.getAllPregnancies);

// GET /api/pregnancies/user/:userId → pregnancies by user
pregnancyRouter.get("/user/:userId", PregnancyController.getPregnanciesByUser);

// GET /api/pregnancies/:id → single pregnancy
pregnancyRouter.get("/:id", PregnancyController.getPregnancyById);

// ================= UPDATE =================
// PUT /api/pregnancies/:id
pregnancyRouter.put("/:id", PregnancyController.updatePregnancy);

// ================= DELETE =================
// DELETE /api/pregnancies/:id
pregnancyRouter.delete("/:id", PregnancyController.deletePregnancy);

export default pregnancyRouter;
