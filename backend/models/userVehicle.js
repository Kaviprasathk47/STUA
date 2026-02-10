import mongoose from "mongoose";
const userVehicleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  vehicle_name: String,
  vehicle_model: String,
  vehicle_manufacture_date: Date,
  fuel_type: String,
  vehicle_type: String,
  vehicle_emission_rating: Number,
  vehicle_engine_size: String,
});
const Vehicle = mongoose.model("UserVehicle", userVehicleSchema);
export default Vehicle;

