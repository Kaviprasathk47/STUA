import {
    getAnalysisSummaryService,
    getModeBreakdownService,
    getEmissionTrendService,
    getVehicleUsageService,
    getCommunityImpactService
} from "../services/analysisService.js";

const getAnalysisSummary = async (req, res) => {
    try {
        const userId = req.user; // req.user is the ID string from auth middleware
        console.log("Analysis Summary Request for User:", userId);
        const summary = await getAnalysisSummaryService(userId);
        console.log("Analysis Summary Result:", summary);
        res.status(200).json({ data: summary });
    } catch (error) {
        console.error("Analysis Summary Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const getModeBreakdown = async (req, res) => {
    try {
        const userId = req.user;
        const breakdown = await getModeBreakdownService(userId);
        console.log("Mode Breakdown Result:", breakdown);
        res.status(200).json({ data: breakdown });
    } catch (error) {
        console.error("Mode Breakdown Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const getEmissionTrend = async (req, res) => {
    try {
        const userId = req.user;
        const { days } = req.query;
        const trend = await getEmissionTrendService(userId, days ? parseInt(days) : 30);
        console.log("Emission Trend Result:", trend);
        res.status(200).json({ data: trend });
    } catch (error) {
        console.error("Emission Trend Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const getVehicleUsage = async (req, res) => {
    try {
        const userId = req.user;
        const usage = await getVehicleUsageService(userId);
        console.log("Vehicle Usage Result:", usage);
        res.status(200).json({ data: usage });
    } catch (error) {
        console.error("Vehicle Usage Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const getCommunityImpact = async (req, res) => {
    try {
        const userId = req.user;
        const impact = await getCommunityImpactService(userId);
        res.status(200).json({ data: impact });
    } catch (error) {
        console.error("Community Impact Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export {
    getAnalysisSummary,
    getModeBreakdown,
    getEmissionTrend,
    getVehicleUsage,
    getCommunityImpact
};
