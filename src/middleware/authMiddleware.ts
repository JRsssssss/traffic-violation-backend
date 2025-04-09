import { Request, Response, NextFunction } from "express";
import { AuthService, UserPayload } from "../service/authService";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

/**
 * Middleware to verify JWT token from the Authorization header
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const user = AuthService.verifyToken(token);

    if (!user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Attach the user object to the request for use in route handlers
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};

/**
 * Middleware to check if user has required roles
 * @param roles Array of roles that are allowed to access the route
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      if (!AuthService.hasRole(req.user.role, roles)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: "Authorization failed" });
    }
  };
};
