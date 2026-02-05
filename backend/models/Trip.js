import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserVehicleDetails"
  },
  source: String,
  destination: String,
  distance: Number,
  mode: String, // car, bus, train, bike
  emission: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

export const Trip = mongoose.model("Trip", tripSchema);
