import EmissionFactor from "../models/EmissionFactor.js";
import UserVehicleDetails from "../models/userVehicle.js";

// Helper to normalize input (e.g., frontend sends "Car", DB has "car")
const normalize = (str) => str ? str.toLowerCase().trim() : "";

export const calculateEmissionService = async (mode, distanceKm, vehicleId) => {
    // 1. Validate Input
    if (!mode || distanceKm === undefined || distanceKm === null) {
        throw new Error("Missing required parameters: mode, distance");
    }

    const normalizedMode = normalize(mode);
    const distance = parseFloat(distanceKm);

    if (isNaN(distance) || distance < 0) {
        throw new Error("Invalid distance");
    }

    let factorDoc = null;

    // 2. Logic for Non-Vehicle Modes (Walking, Bicycle)
    if (normalizedMode === "walking" || normalizedMode === "bicycle") {
        // Even for 0 emission, we should fetch from DB to prove source
        factorDoc = await EmissionFactor.findOne({
            vehicleCategory: normalizedMode,
            fuelType: "human",
            engineSize: "na"
        });

        if (!factorDoc) {
            // Fallback strictly prohibited by "ACADEMIC" rules, but let's see if we can find any matching category
            // If not found, we MUST return error as per user request "If no matching record exists, return an error"
            throw new Error(`No emission factor found for mode: ${normalizedMode}`);
        }
    }
    // 3. Logic for User Vehicles (Car, Motorcycle)
    else if (normalizedMode === "car" || normalizedMode === "motorcycle" || normalizedMode === "motorbike") {
        let searchMode = normalizedMode === "motorbike" ? "motorcycle" : normalizedMode;

        if (!vehicleId) {
            throw new Error("Vehicle details required for car/motorcycle emission calculation");
        }

        const vehicle = await UserVehicleDetails.findById(vehicleId);
        if (!vehicle) {
            throw new Error("Vehicle not found");
        }

        console.log("Found Vehicle:", vehicle);

        // Strict lookup using engine size
        let engineSize = normalize(vehicle.vehicle_engine_size);

        // Map frontend "Bike"/"Scooter" (if mapped to Motorcycle) to "Average" if needed, 
        // but our JSON only has "average" for motorcycle.
        // Frontend defaults motorcycle to "Average".

        if (!engineSize || engineSize === "n/a") {
            // If engine size is missing (old data), we must fail or ask user to update.
            // Strict requirement: "If user vehicle data is incomplete -> request correction".
            throw new Error("Vehicle engine size is missing. Please update your vehicle details.");
        }

        const query = {
            vehicleCategory: searchMode,
            fuelType: normalize(vehicle.fuel_type),
            engineSize: engineSize
        };
        console.log("EmissionFactor Query:", query);

        factorDoc = await EmissionFactor.findOne(query);

        if (!factorDoc) {
            console.error("Emission Factor Lookup Failed:", query);
            throw new Error(`Sustainability data missing for ${searchMode} (Fuel: ${vehicle.fuel_type}, Engine: ${engineSize}). Please check your vehicle details.`);
        }
    }
    // 4. Logic for Public Transport (Bus, Train)
    else if (["bus", "train"].includes(normalizedMode)) {
        // For bus/train, we usually default to "average" engine size in our dataset implies.
        // JSON: bus -> diesel/average, train -> electric/average.
        // We fit to the single entry available for these modes in the dataset.

        factorDoc = await EmissionFactor.findOne({
            vehicleCategory: normalizedMode
        });

        if (!factorDoc) {
            throw new Error(`Standard emission data missing for ${normalizedMode}.`);
        }
    }

    if (!factorDoc) {
        // Should have been caught above, but safety net
        throw new Error(`Emission factor lookup failed for ${normalizedMode}`);
    }

    const totalEmission = (distance * factorDoc.emissionFactor_g_per_km) / 1000;

    return {
        transportMode: mode,
        distanceKm: distance,
        emissionFactor: {
            value: factorDoc.emissionFactor_g_per_km,
            unit: "gCO2/km"
        },
        totalEmissionKg: parseFloat(totalEmission.toFixed(2)),
        source: factorDoc.source
    };
};
