// src/middlewares/bearAuth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

type DecodedToken = {
  userId: number;
  userEmail: string;
  userType: "mother" | "health_worker" | "admin" | "policy_maker";
};

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export const authMiddleware = (
  allowedRoles: string[] | "any" = "any"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as DecodedToken;

      req.user = decoded;

      if (
        allowedRoles === "any" ||
        allowedRoles.includes(decoded.userType)
      ) {
        return next();
      }

      return res.status(403).json({
        error: "Forbidden: insufficient permissions",
      });
    } catch (err) {
      return res.status(401).json({
        error: "Invalid or expired token",
      });
    }
  };
};

// shortcuts
export const authenticate = authMiddleware("any");
export const motherOnly = authMiddleware(["mother"]);
export const adminOnly = authMiddleware(["admin"]);
export const policyOnly = authMiddleware(["policy_maker"]);
export const staffOnly = authMiddleware([
  "admin",
  "policy_maker",
]);