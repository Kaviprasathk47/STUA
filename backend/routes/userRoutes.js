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

const router = Router();

router.post("/signup", postUserDetailsController);
router.post("/login", getUserDetailsController);
router.post("/auth/firebase", postLoginUsingFireBaseCntrl);


router.get("/auth/me", protect, getMeController);
router.put("/auth/me", protect, updateUserProfileController);
router.put("/auth/change-password", protect, changePasswordController);
router.post("/auth/complete-onboarding", protect, completeOnboardingController);
router.post("/auth/refresh", refreshController);

export default router;
