
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const tripSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "UserVehicleDetails" },
    source: String,
    destination: String,
    distance: Number,
    mode: String,
    emission: Number,
    date: { type: Date, default: Date.now }
}, { collection: 'trips' });

const userVehicleSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vehicle_name: String,
    vehicle_type: String
}, { collection: 'uservehicles' });

const Trip = mongoose.model('Trip', tripSchema);
const UserVehicle = mongoose.model('UserVehicle', userVehicleSchema);

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const results = [];
        const trips = await Trip.find({}).sort({ date: -1 }).limit(10);

        for (const t of trips) {
            let vName = "N/A";
            if (t.vehicleId) {
                const v = await UserVehicle.findById(t.vehicleId);
                vName = v ? v.vehicle_name : "NOT FOUND (ID: " + t.vehicleId + ")";
            }
            results.push({
                id: t._id,
                userId: t.userId,
                vehicleId: t.vehicleId,
                mode: t.mode,
                date: t.date,
                linkedVehicleName: vName
            });
        }
        fs.writeFileSync('debug_data.json', JSON.stringify(results, null, 2));
        console.log("Data written to debug_data.json");
        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
};

checkData();
