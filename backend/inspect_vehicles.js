const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const vehicleSchema = new mongoose.Schema({
    vehicle_name: String,
    vehicle_type: String, // Bike, Car, etc.
    fuel_type: String,
    vehicle_emission_rating: Number, // old field
    vehicle_engine_size: String // new field
}, { collection: 'uservehicledetails' }); // Check collection name case strictly

const UserVehicle = mongoose.model('UserVehicle', vehicleSchema);

const checkVehicles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const vehicles = await UserVehicle.find({});
        console.log(`Found ${vehicles.length} vehicles.`);

        vehicles.forEach(v => {
            console.log(`- Name: ${v.vehicle_name}, Type: ${v.vehicle_type}, Fuel: ${v.fuel_type}, Engine: ${v.vehicle_engine_size}`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
};

checkVehicles();
