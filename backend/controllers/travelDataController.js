import {
    createTravelDataService,
    getTravelHistoryService,
} from "../services/travelDataService.js";

export const postTravelDataFn = async (req, res) => {
    try {
        const { userId, tripId, vehicleId, mode, distance_travelled_km, data_travelled_co2, origin, destination, date } = req.body;
        // Assuming user ID is passed via auth middleware if available, but for now using req.body.userId if provided, else req.user
        const user = req.user || userId;

        if (!user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const travelData = await createTravelDataService(
            user,
            tripId,
            vehicleId,
            mode,
            distance_travelled_km,
            data_travelled_co2,
            origin,
            destination,
            undefined, // placeholder for displayName
            undefined, // placeholder for displayName
            date
        );

        res.status(201).json({
            message: "Travel data saved successfully",
            travelData,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error saving travel data",
            error: err.message,
        });
    }
};

export const getTravelHistoryFn = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const history = await getTravelHistoryService(user);
        res.status(200).json({
            message: "Travel history fetched successfully",
            data: history,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching travel history",
            error: err.message,
        });
    }
};
