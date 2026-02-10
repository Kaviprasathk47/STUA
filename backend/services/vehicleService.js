import mongoose from "mongoose";
import Vehicle from "../models/userVehicle.js";
import AppError from "../utils/appError.js";

const posttheVehicleDetailsService = async (
  userId,
  vehicle_name,
  vehicle_model,
  vehicle_type,
  vehicle_manufacture_date,
  fuel_type,
  vehicle_emission_rating,
) => {
  const newVehicle = new Vehicle({
    userId: userId,
    vehicle_name: vehicle_name,
    vehicle_model: vehicle_model,
    vehicle_type: vehicle_type,
    vehicle_manufacture_date: vehicle_manufacture_date,
    fuel_type: fuel_type,
    vehicle_emission_rating: vehicle_emission_rating,
  });
  const savedUser = await newVehicle.save();
  return savedUser;
};
const getTheVehicleDetailsAllService = async (userId) => {
  const data_reponse = await Vehicle.find({ userId: userId }).sort({ _id: -1 });
  if (data_reponse.length == 0) {
    return []; // Return empty array instead of error for empty list
  }
  return data_reponse;
};
const getTheVehicleDetailsService = async (userId, identifier) => {
  let query;

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    query = { _id: identifier, userId };
  } else {
    query = { vehicle_name: identifier, userId };
  }
  const data_reponse = await Vehicle.find(query);
  if (data_reponse.length == 0) {
    throw new AppError(
      "No data Found for the Specific User and Vehicle Name",
      404,
    );
  }
  return data_reponse;
};
const updateVehicleDetailsService = async (
  userId,
  vehicleId,
  data_to_update,
) => {
  const updated_data = await Vehicle.findOneAndUpdate(
    { _id: vehicleId, userId: userId }, // Query to ensure user owns vehicle
    data_to_update,
    { new: true }
  );
  if (!updated_data) {
    throw new AppError("No data Found to Update for the Specific Vehicle", 404);
  }
  return updated_data;
};
const deleteVehicleDetailsService = async (userId, vehicleId) => {
  const deleted_data = await Vehicle.deleteOne({
    userId: userId,
    _id: vehicleId,
  });
  if (deleted_data.deletedCount == 0) {
    throw new AppError("No data Found to Delete for the Specific Vehicle", 404);
  }
  return deleted_data;
};

export {
  posttheVehicleDetailsService,
  getTheVehicleDetailsAllService,
  getTheVehicleDetailsService,
  updateVehicleDetailsService,
  deleteVehicleDetailsService,
};
