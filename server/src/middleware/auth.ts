import { Request, Response, NextFunction } from "express";
import { PublicUser, UserRole } from "../types";
import { verifyToken } from "../utils/auth";
import { UserStore } from "../data/userStore";
import { toPublicUser } from "../utils/auth";

declare global {
  namespace Express {
    interface Request {
      user?: PublicUser;
    }
  }
}

export async function protect(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: "Authentication required. Please log in." });
    return;
  }

  try {
    const decoded = verifyToken(header.slice(7));
    const user = await UserStore.getById(decoded.id);
    if (!user) {
      res.status(401).json({ success: false, error: "Account no longer exists. Please log in again." });
      return;
    }
    req.user = toPublicUser(user);
    next();
  } catch {
    res.status(401).json({ success: false, error: "Invalid or expired token. Please log in again." });
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Authentication required. Please log in." });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `This action requires one of: ${roles.join(", ")}`,
      });
      return;
    }
    next();
  };
}
