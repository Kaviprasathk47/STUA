import express from "express";
import { postTravelDataFn, getTravelHistoryFn } from "../controllers/travelDataController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, postTravelDataFn);
router.get("/history", protect, getTravelHistoryFn);

export default router;
