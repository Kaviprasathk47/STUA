import mongoose from "mongoose";
import dotenv from "dotenv";
import EmissionFactor from "./models/EmissionFactor.js";
import UserVehicleDetails from "./models/userVehicle.js";
import { calculateEmissionService } from "./services/emissionService.js";

dotenv.config();

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // 1. Check Motorcycle Factors
        const factors = await EmissionFactor.find({ vehicleCategory: { $in: ["motorcycle", "motorbike"] } });
        console.log("Motorcycle Factors:", factors.map(f => `${f.vehicleCategory} - ${f.engineSize}`));

        // 2. Create Test Vehicle (Bike + Small) - Simulating "Royal Enfield" issue?
        const vehicle = await UserVehicleDetails.create({
            vehicle_name: "Test Royal Enfield",
            vehicle_type: "Bike",
            fuel_type: "Petrol",
            vehicle_model: "Classic 350",
            vehicle_manufacture_date: new Date(),
            vehicle_emission_rating: 0.4,
            vehicle_engine_size: "Small", // Incorrect for Moto in DB?
            userId: new mongoose.Types.ObjectId()
        });
        console.log("Created Test Vehicle:", vehicle._id);

        // 3. Try Calculate for Motorcycle
        try {
            console.log("Attempting Calculation...");
            const result = await calculateEmissionService("motorcycle", 10, vehicle._id);
            console.log("Result:", result);
        } catch (e) {
            console.log("Calculation Failed (Expected?):", e.message);
        }

        // Cleanup
        await UserVehicleDetails.findByIdAndDelete(vehicle._id);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

debug();
