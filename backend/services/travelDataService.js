import travel_details from "../models/travel_data.js";
import { Trip } from "../models/Trip.js";

export const createTravelDataService = async (
    userId,
    tripId, // This might be null/undefined from controller now
    vehicleId,
    mode,
    distance_travelled_km,
    data_travelled_co2,
    origin,
    destination,
    sourceDisplayName,
    destinationDisplayName,
    date // New parameter
) => {
    const travelDate = date ? new Date(date) : new Date();

    // 1. Create a Trip entry first
    const newTrip = new Trip({
        userId,
        vehicleId,
        source: origin,
        sourceDisplayName: sourceDisplayName || origin,
        destination,
        destinationDisplayName: destinationDisplayName || destination,
        distance: distance_travelled_km,
        mode,
        emission: data_travelled_co2,
        date: travelDate
    });

    const savedTrip = await newTrip.save();

    // 2. Create travel_details linked to the Trip
    const newTravelData = new travel_details({
        userId,
        tripId: savedTrip._id,
        vehicleId,
        mode,
        distance_travelled_km,
        data_travelled_co2, // Note: Schema has 'data' field for date, careful not to confuse
        data: travelDate,
    });

    await newTravelData.save();
    return newTravelData;
};

export const getTravelHistoryService = async (userId) => {
    const history = await travel_details
        .find({ userId })
        .sort({ data: -1 })
        .populate("vehicleId", "vehicle_name vehicle_type")
        .populate("tripId", "source destination");
    return history;
};
