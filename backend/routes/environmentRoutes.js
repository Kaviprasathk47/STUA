import express from "express";
import { getAQI } from "../controllers/environmentController.js";

const router = express.Router();

router.get("/aqi", getAQI);

export default router;
