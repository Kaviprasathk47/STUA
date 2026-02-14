import {
    createTravelDataService,
    getTravelHistoryService,
    updateTripService,
    deleteTripService,
} from "../services/travelDataService.js";
import { userGradeService } from "../services/userGradeService.js";

export const postTravelDataFn = async (req, res) => {
    try {
        const { userId, tripId, vehicleId, mode, distance, emission, source, destination, sourceDisplayName, destinationDisplayName, date } = req.body;
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
            distance, // distance_travelled_km
            emission, // data_travelled_co2
            source,   // origin
            destination,
            sourceDisplayName,
            destinationDisplayName,
            date
        );

        // Update User Grade (Gamification)
        try {
            await userGradeService.updateUserGrade(user, mode, distance);
        } catch (gradeError) {
            console.error("Failed to update user grade:", gradeError.message);
            // Don't fail the request if gamification update fails
        }

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

export const updateTripFn = async (req, res) => {
    try {
        const tripId = req.params.id;
        const userId = req.user;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const {
            source,
            sourceDisplayName,
            destination,
            destinationDisplayName,
            mode,
            vehicleId,
            distance,
            emission
        } = req.body;

        // Validate required recalculated fields
        if (distance === undefined || emission === undefined) {
            return res.status(400).json({
                message: "Distance and emission must be recalculated and provided"
            });
        }

        const updatedTrip = await updateTripService(tripId, userId, {
            source,
            sourceDisplayName,
            destination,
            destinationDisplayName,
            mode,
            vehicleId,
            distance,
            emission
        });

        res.status(200).json({
            message: "Trip updated successfully",
            data: updatedTrip
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Error updating trip",
        });
    }
};

export const deleteTripFn = async (req, res) => {
    try {
        const tripId = req.params.id;
        const userId = req.user;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const result = await deleteTripService(tripId, userId);

        res.status(200).json(result);
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Error deleting trip",
        });
    }
};
