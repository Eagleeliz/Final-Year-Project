import express, { Request, Response } from "express";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Backend running with TypeScript 🚀");
});

// Export the app
export default app;
