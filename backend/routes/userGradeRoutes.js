import express from "express";
import { getUserGrade, updateUserGrade, getLeaderboard } from "../controllers/userGradesController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/leaderboard", protect, getLeaderboard);
router.get("/:userId", protect, getUserGrade);
router.post("/update/:userId", protect, updateUserGrade); // Optional, mostly for testing/admin

export default router;
