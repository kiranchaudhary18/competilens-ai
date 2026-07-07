import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

const app = express();

// 1. Basic security headers
app.use(helmet());

// 2. Enable Gzip compression
app.use(compression());

// 3. Setup CORS with options
app.use(cors({
  origin: true,
  credentials: true,
}));

// 4. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Cookie parser
app.use(cookieParser());

// 6. Request Logging with Morgan
app.use(morgan("dev"));

// 7. Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later."
  }
});
app.use(limiter);

// 8. Base Health Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "CompetiLens AI Backend Running",
    version: "1.0.0"
  });
});

// 9. 404 Route handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Resource not found - ${req.originalUrl}`
  });
});

// 10. Global Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  console.error(`[Error Handler] ${statusCode} - ${message}`, err.stack);
  
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

export default app;
