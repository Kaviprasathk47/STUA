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
const travel_details = mongoose.model("travel_details", travelDataSchema);
export default travel_details;