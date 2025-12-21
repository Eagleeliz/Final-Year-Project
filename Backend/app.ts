import express, { Request, Response } from "express";

import weekRouter from './src/Weeks/week.route'
import cors from "cors";
import dotenv from 'dotenv'
import userRouter from "./src/users/user.route";

dotenv.config() //loads the env file 

const app = express();

// Basicc Middleware
app.use(cors());

//normal parers add
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Default route
app.get("/", (req: Request, res: Response) => {
  res.send("Backend running with TypeScript 🚀");
});
//Routers
app.use('/api/weeks',weekRouter)
app.use('/api/users',userRouter)


//404 handler
app.use((req,res)=>{
  res.status(404).json({error:"Route not found"})
})
// Export the app
export default app;
