import express from "express";
import { calculateEmissionFn } from "../controllers/emissionController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/calculate", protect, calculateEmissionFn);

export default router;
