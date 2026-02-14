import express from "express";
import { postTravelDataFn, getTravelHistoryFn, updateTripFn, deleteTripFn } from "../controllers/travelDataController.js";
import protect from "../middleware/authMiddleware.js";
import { validateTripData, validateTripUpdate } from "../middleware/validation.js";
import { tripCreationLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/add", protect, tripCreationLimiter, validateTripData, postTravelDataFn);
router.get("/history", protect, getTravelHistoryFn);
router.put("/update/:id", protect, validateTripUpdate, updateTripFn);
router.delete("/delete/:id", protect, deleteTripFn);

export default router;
