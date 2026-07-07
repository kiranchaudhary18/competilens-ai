import { Request, Response, NextFunction } from "express";
import { TokenService, TokenPayload } from "../service/token.service";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Access token missing or invalid",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = TokenService.verifyAccessToken(token);
    
    req.user = decoded;
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: err.name === "TokenExpiredError" ? "Access token expired" : "Invalid access token",
    });
  }
};
