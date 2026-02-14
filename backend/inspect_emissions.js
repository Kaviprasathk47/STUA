import mongoose from 'mongoose';
import EmissionFactor from './models/EmissionFactor.js';
import dotenv from 'dotenv';

dotenv.config();

const checkFactors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const categories = await EmissionFactor.distinct('vehicleCategory');
        console.log("Categories:", categories);

        const fuels = await EmissionFactor.distinct('fuelType');
        console.log("Fuels:", fuels);

        const sizes = await EmissionFactor.distinct('engineSize');
        console.log("Sizes:", sizes);

        const allDocs = await EmissionFactor.find({}).limit(5);
        console.log("Samples:", allDocs);

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkFactors();
