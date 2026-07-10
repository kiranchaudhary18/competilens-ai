import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { ZodError } from "zod";
import authRoutes from "./modules/auth/routes/auth.routes";
import workspaceRoutes from "./modules/workspace/routes/workspace.routes";
import competitorRoutes from "./modules/competitor/routes/competitor.routes";
import signalRoutes from "./modules/signal/routes/signal.routes";
import analysisRoutes from "./modules/analysis/analysis.routes";
import collectionRoutes from "./modules/collection/collection.routes";
import memoryRoutes from "./modules/memory/memory.routes";
import notificationRoutes from "./modules/notifications/notification.routes";
import reportRoutes from "./modules/reports/report.routes";

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

// 8. Register Routes
app.use("/auth", authRoutes);
app.use("/workspace", workspaceRoutes);
app.use("/competitors", competitorRoutes);
app.use("/signals", signalRoutes);
app.use("/analyses", analysisRoutes);
app.use("/collection", collectionRoutes);
app.use("/memory", memoryRoutes);
app.use("/notifications", notificationRoutes);
app.use("/reports", reportRoutes);

// 9. Base Health Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "CompetiLens AI Backend Running",
    version: "1.0.0"
  });
});

// 10. 404 Route handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Resource not found - ${req.originalUrl}`
  });
});

// 11. Global Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors: any = undefined;

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errors = err.issues.map((e: any) => ({
      field: e.path.join("."),
      message: e.message
    }));
  }
  
  console.error(`[Error Handler] ${statusCode} - ${message}`, err.stack);
  
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

export default app;
