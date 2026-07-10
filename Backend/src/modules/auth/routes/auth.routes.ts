import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refresh);
router.get("/verify-email", AuthController.verifyEmail);

// Protected routes
router.post("/logout", authenticateUser as any, AuthController.logout as any);
router.get("/me", authenticateUser as any, AuthController.getCurrentUser as any);
router.patch("/profile", authenticateUser as any, AuthController.updateProfile as any);

export default router;
