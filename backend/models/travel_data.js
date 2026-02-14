import mongoose from "mongoose";

const travelDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserVehicleDetails"
    },
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip"
    },
    data: {
        type: Date,
        required: true,
        default: new Date()
    },
    mode: String,
    data_travelled_co2: Number,
    distance_travelled_km: Number,
});

// Add indexes for better query performance
travelDataSchema.index({ userId: 1, data: -1 }); // Compound index for user's travel data sorted by date
travelDataSchema.index({ userId: 1 }); // Index for user queries
travelDataSchema.index({ tripId: 1 }); // Index for trip-based queries

const travel_details = mongoose.model("travel_details", travelDataSchema);
export default travel_details;