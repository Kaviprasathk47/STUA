import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.js";
import EmissionFactor from "../models/EmissionFactor.js";

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), "../.env") });

const seedEmissions = async () => {
    try {
        await connectDB();

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const dataPath = path.join(__dirname, "../config/vehicleEmissionFactors.json");

        // Check if file exists
        try {
            await fs.access(dataPath);
        } catch {
            console.error(`Emission factors file not found at: ${dataPath}`);
            process.exit(1);
        }

        const data = await fs.readFile(dataPath, "utf-8");
        const emissionFactors = JSON.parse(data);

        // Clear existing data? Maybe. Let's update or insert.
        // For now, let's clear to ensure we match the source of truth exactly.
        await EmissionFactor.deleteMany({});
        console.log("Cleared existing emission factors.");

        await EmissionFactor.insertMany(emissionFactors);
        console.log("Emission factors seeded successfully.");

        process.exit();
    } catch (error) {
        console.error("Error seeding emission factors:", error);
        process.exit(1);
    }
};

seedEmissions();
