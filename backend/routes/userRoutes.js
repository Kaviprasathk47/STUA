import { Router } from "express";
import {
  getUserDetailsController,
  postUserDetailsController,
  postLoginUsingFireBaseCntrl,
  getMeController,
  refreshController,
  updateUserProfileController,
  changePasswordController,
  completeOnboardingController
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validateUserRegistration, validateUserLogin } from "../middleware/validation.js";

const router = Router();

// Authentication routes with rate limiting and validation
router.post("/signup", authLimiter, validateUserRegistration, postUserDetailsController);
router.post("/login", authLimiter, validateUserLogin, getUserDetailsController);
router.post("/auth/firebase", authLimiter, postLoginUsingFireBaseCntrl);

// Protected routes
router.get("/auth/me", protect, getMeController);
router.put("/auth/me", protect, updateUserProfileController);
router.put("/auth/change-password", protect, changePasswordController);
router.post("/auth/complete-onboarding", protect, completeOnboardingController);
router.post("/auth/refresh", refreshController);

export default router;
