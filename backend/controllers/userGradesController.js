import { userGradeService } from '../services/userGradeService.js';

const getUserGrade = async (req, res) => {
    try {
        const { userId } = req.params;
        const userStats = await userGradeService.getUserGrade(userId);
        return res.status(200).json({ success: true, data: userStats });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Internal use primarily, but exposed if needed for specific updates
const updateUserGrade = async (req, res) => {
    try {
        const { userId } = req.params;
        const { mode, distance } = req.body;

        if (!mode || distance === undefined) {
            return res.status(400).json({ success: false, message: "Mode and distance are required." });
        }

        const result = await userGradeService.updateUserGrade(userId, mode, distance);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await userGradeService.getLeaderboard();
        return res.status(200).json({ success: true, data: leaderboard });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export { getUserGrade, updateUserGrade, getLeaderboard };