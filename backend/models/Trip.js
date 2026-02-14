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
  sourceDisplayName: String,
  destination: String,
  destinationDisplayName: String,
  distance: Number,
  mode: String, // car, bus, train, bike
  emission: Number,
  date: {
    type: Date,
    default: Date.now
  },
  lastUpdatedAt: {
    type: Date,
    default: null
  }
});

// Add indexes for better query performance
tripSchema.index({ userId: 1, date: -1 }); // Compound index for user's trips sorted by date
tripSchema.index({ userId: 1 }); // Index for user queries
tripSchema.index({ date: -1 }); // Index for date-based queries


export const Trip = mongoose.model("Trip", tripSchema);
