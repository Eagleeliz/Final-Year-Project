import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// 1. Updated Payload for your 3 specific user types
type DecodedToken = {
  userId: string;
  email: string;
  role: 'mother' | 'admin' | 'policy_maker'; // Your 3 user groups
  name: string;
  exp: number;
};

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export const verifyToken = (token: string, secret: string): DecodedToken | null => {
  try {
    return jwt.verify(token, secret) as DecodedToken;
  } catch (error) {
    return null;
  }
};

export const authMiddleware = (allowedRoles: string[] | "any" = "any") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization");
    
    let token = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null;
    if (token) {
      token = token.replace(/[\\"]/g, '').trim(); 
    }

    if (!token) {
      return res.status(401).json({ error: "Access Denied: Please log in to BabyCentre Care" });
    }

    const decodedToken = verifyToken(token, process.env.JWT_SECRET!);
    if (!decodedToken) {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }

    req.user = decodedToken;

    // Role Check
    if (allowedRoles === "any" || allowedRoles.includes(decodedToken.role)) {
      return next();
    }

    return res.status(403).json({ error: "Forbidden: Your account level does not have access to this dashboard." });
  };
};

// 2. Specific Exports for your 3 Dashboards
export const motherOnly = authMiddleware(["mother"]);
export const adminOnly  = authMiddleware(["admin"]);
export const policyOnly = authMiddleware(["policy_maker"]);

// 3. Combined Permissions (Example: Both Admin and Policy Makers can see Stats)
export const staffOnly  = authMiddleware(["admin", "policy_maker"]);