import { Router } from "express";
import {
    getAnalysisSummary,
    getModeBreakdown,
    getEmissionTrend,
    getVehicleUsage,
    getCommunityImpact
} from "../controllers/analysisController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect); // Protect all analysis routes

router.get("/summary", getAnalysisSummary);
router.get("/mode-breakdown", getModeBreakdown);
router.get("/trend", getEmissionTrend);
router.get("/vehicle-usage", getVehicleUsage);
router.get("/impact", getCommunityImpact);

export default router;
