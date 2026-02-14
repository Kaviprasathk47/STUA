import mongoose from 'mongoose';
import EmissionFactor from './models/EmissionFactor.js';
import dotenv from 'dotenv';

dotenv.config();

const addFactors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const newFactors = [
            // Electric Motorcycles
            { vehicleCategory: 'motorcycle', fuelType: 'electric', engineSize: 'average', emissionFactor_g_per_km: 0, source: 'Calculated (Tailpipe)' },
            { vehicleCategory: 'motorcycle', fuelType: 'electric', engineSize: 'small', emissionFactor_g_per_km: 0, source: 'Calculated (Tailpipe)' },
            { vehicleCategory: 'motorcycle', fuelType: 'electric', engineSize: 'medium', emissionFactor_g_per_km: 0, source: 'Calculated (Tailpipe)' },
            { vehicleCategory: 'motorcycle', fuelType: 'electric', engineSize: 'large', emissionFactor_g_per_km: 0, source: 'Calculated (Tailpipe)' },

            // Electric Cars
            { vehicleCategory: 'car', fuelType: 'electric', engineSize: 'average', emissionFactor_g_per_km: 0, source: 'Calculated (Tailpipe)' },
            { vehicleCategory: 'car', fuelType: 'electric', engineSize: 'small', emissionFactor_g_per_km: 0, source: 'Calculated (Tailpipe)' },
            { vehicleCategory: 'car', fuelType: 'electric', engineSize: 'medium', emissionFactor_g_per_km: 0, source: 'Calculated (Tailpipe)' },
            { vehicleCategory: 'car', fuelType: 'electric', engineSize: 'large', emissionFactor_g_per_km: 0, source: 'Calculated (Tailpipe)' },

            // Hybrid Cars (Approximate values if missing, e.g. 50-70% of petrol)
            { vehicleCategory: 'car', fuelType: 'hybrid', engineSize: 'average', emissionFactor_g_per_km: 120, source: 'Estimate' },
        ];

        for (const factor of newFactors) {
            try {
                // Use updateOne with upsert to avoid duplicates or errors
                await EmissionFactor.updateOne(
                    {
                        vehicleCategory: factor.vehicleCategory,
                        fuelType: factor.fuelType,
                        engineSize: factor.engineSize
                    },
                    { $set: factor },
                    { upsert: true }
                );
                console.log(`Upserted: ${factor.vehicleCategory} ${factor.fuelType} ${factor.engineSize}`);
            } catch (err) {
                console.error(`Error adding ${factor.vehicleCategory} ${factor.fuelType}:`, err.message);
            }
        }

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

addFactors();
