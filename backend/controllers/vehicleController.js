import {
  posttheVehicleDetailsService,
  getTheVehicleDetailsAllService,
  getTheVehicleDetailsService,
  updateVehicleDetailsService,
  deleteVehicleDetailsService,
} from "../services/vehicleService.js";

const posttheVehicleDetailsCntrl = async (req, res) => {
  try {
    const {
      vehicle_name,
      vehicle_model,
      vehicle_type,
      vehicle_manufacture_date,
      fuel_type,
      vehicle_emission_rating,
    } = req.body;

    // Log for debugging
    console.log("Adding vehicle:", req.body);
    console.log("User ID:", req.user);

    const vechiclResponse = await posttheVehicleDetailsService(
      req.user, // Use req.user directly (it is the ID string)
      vehicle_name,
      vehicle_model,
      vehicle_type,
      vehicle_manufacture_date,
      fuel_type,
      vehicle_emission_rating,
    );
    res.status(201).json({
      message: "Vehicle details posted successfully",
      data: vechiclResponse,
    });
  } catch (error) {
    console.error("Error adding vehicle:", error);
    res.status(500).json({
      message: "Post Function failed",
      error: error.message,
    });
  }
};
const getTheVehicleDetailsCntrl = async (req, res) => {
  try {
    const { identifier } = req.params;
    const VehicleServiceResponse = await getTheVehicleDetailsService(
      req.user,
      identifier,
    );
    res.status(200).json({
      message: "Vehicle details fetched successfully",
      data: VehicleServiceResponse,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      Error: err.message,
      message: "Error : Fetching the Vehicle details got failed",
    });
  }
};
const getTheVehicleDetailsAllCntrl = async (req, res) => {
  try {
    const VehicleServiceAllResponse = await getTheVehicleDetailsAllService(
      req.user,
    );
    res.status(200).json({
      message: "All Vehicle details fetched successfully",
      data: VehicleServiceAllResponse,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: "Error : Fetching all Vehicle details got failed",
      error: err.message,
    });
  }
};
const updateVehicleDetailsCntrl = async (req, res) => {
  try {
    const { id } = req.params; // Route uses :id
    const data_to_update = req.body; // Frontend sends data directly

    console.log("Updating Vehicle ID:", id);
    console.log("Update Data:", data_to_update);

    const VehicleUpdateResponse = await updateVehicleDetailsService(
      req.user,
      id,
      data_to_update,
    );
    res.status(200).json({
      message: "Vehicle details updated successfully",
      data: VehicleUpdateResponse,
    });
  } catch (err) {
    res.status(500).json({
      message: "Update Function failed",
      error: err.message,
    });
  }
};
const deleteVehicleDetailsCntrl = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const VehicleDeleteResponse = await deleteVehicleDetailsService(req.user, vehicleId);
    res.status(200).json({
      message: "Vehicle details deleted successfully",
      data: VehicleDeleteResponse,
    });
  } catch (err) {
    res.status(500).json({
      message: "Delete Function failed",
      error: err.message,
    });
  }
};
export {
  posttheVehicleDetailsCntrl,
  getTheVehicleDetailsCntrl,
  getTheVehicleDetailsAllCntrl,
  updateVehicleDetailsCntrl,
  deleteVehicleDetailsCntrl,
};
