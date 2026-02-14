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

export const updateTripService = async (
    tripId,
    userId,
    updateData // { source, sourceDisplayName, destination, destinationDisplayName, mode, vehicleId, distance, emission }
) => {
    // 1. Find the trip and verify ownership
    const trip = await Trip.findById(tripId);

    if (!trip) {
        const error = new Error("Trip not found");
        error.statusCode = 404;
        throw error;
    }

    if (trip.userId.toString() !== userId.toString()) {
        const error = new Error("Unauthorized: You can only edit your own trips");
        error.statusCode = 403;
        throw error;
    }

    // 2. Update trip fields
    if (updateData.source !== undefined) trip.source = updateData.source;
    if (updateData.sourceDisplayName !== undefined) trip.sourceDisplayName = updateData.sourceDisplayName;
    if (updateData.destination !== undefined) trip.destination = updateData.destination;
    if (updateData.destinationDisplayName !== undefined) trip.destinationDisplayName = updateData.destinationDisplayName;
    if (updateData.mode !== undefined) trip.mode = updateData.mode;
    if (updateData.vehicleId !== undefined) trip.vehicleId = updateData.vehicleId;

    // 3. Recalculate distance and emission (these MUST be provided from frontend calculation)
    if (updateData.distance !== undefined) trip.distance = updateData.distance;
    if (updateData.emission !== undefined) trip.emission = updateData.emission;

    // 4. Update timestamp
    trip.lastUpdatedAt = new Date();

    // 5. Save updated trip
    const updatedTrip = await trip.save();

    // 6. Update corresponding travel_details record
    await travel_details.findOneAndUpdate(
        { tripId: tripId },
        {
            mode: trip.mode,
            distance_travelled_km: trip.distance,
            data_travelled_co2: trip.emission,
            vehicleId: trip.vehicleId
        }
    );

    return updatedTrip;
};

export const deleteTripService = async (tripId, userId) => {
    // 1. Find the trip and verify ownership
    const trip = await Trip.findById(tripId);

    if (!trip) {
        const error = new Error("Trip not found");
        error.statusCode = 404;
        throw error;
    }

    if (trip.userId.toString() !== userId.toString()) {
        const error = new Error("Unauthorized: You can only delete your own trips");
        error.statusCode = 403;
        throw error;
    }

    // 2. Delete the trip
    await Trip.findByIdAndDelete(tripId);

    // 3. Delete corresponding travel_details record
    await travel_details.findOneAndDelete({ tripId: tripId });


    return { message: "Trip deleted successfully" };
};

