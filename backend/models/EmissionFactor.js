import mongoose from "mongoose";

const emissionFactorSchema = new mongoose.Schema({
    vehicleCategory: {
        type: String,
        required: true, // car, bus, train, motorcycle, bicycle, walking
        lowercase: true,
    },
    fuelType: {
        type: String,
        required: true, // petrol, diesel, hybrid, electric, human, na
        lowercase: true,
    },
    engineSize: {
        type: String,
        required: true, // small, medium, large, average, na
        lowercase: true,
    },
    emissionFactor_g_per_km: {
        type: Number,
        required: true,
    },
    source: {
        type: String,
        required: true,
    }
});

// Compound index for fast lookups and uniqueness
emissionFactorSchema.index({ vehicleCategory: 1, fuelType: 1, engineSize: 1 }, { unique: true });

const EmissionFactor = mongoose.model("EmissionFactor", emissionFactorSchema);

export default EmissionFactor;
