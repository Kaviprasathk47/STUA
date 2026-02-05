import mongoose from "mongoose";
const userVehicleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  vehicle_name: String,
  vehicle_model: String,
  vehicle_manufacture_date: Date,
  vehicle_emission_rating: Number
});
const Vehicle = mongoose.model("UserVehicle", userVehicleSchema);
export default Vehicle; 

