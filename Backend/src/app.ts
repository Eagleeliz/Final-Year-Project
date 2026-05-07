import express, { Request, Response } from "express";
import weekRouter from './Weeks/week.route'
import cors from "cors";
import userRouter from "./users/user.route";
import pregnancyRouter from "./pregnancy/pregnancy.route";
import guidanceRouter from "./guidance/guidance.route";
import aiRouter from "./groqai/groq.route";
import { authRouter } from "./auth/auth.route";
import clinicReminderRouter from "./ClinicReminders/clinicReminder.route";
import childRouter from "./child/child.route";
import emergencyRouter from "./emergency/emergency.route";
import dashboardRouter from "./PolicyMaker/policyMakerRoute";

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get("/", (req: Request, res: Response) => {
  res.send("Backend running with TypeScript");
});

app.use('/api/weeks', weekRouter)
app.use('/api/users', userRouter)
app.use('/api/pregnancies', pregnancyRouter)
app.use('/api/guidance', guidanceRouter);
app.use('/api/ai', aiRouter)
app.use('/api/auth', authRouter)
app.use("/api/clinic-reminders", clinicReminderRouter);
app.use("/api/emergency", emergencyRouter);
app.use("/api/children", childRouter);
app.use("/api/dashboard", dashboardRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

export default app;