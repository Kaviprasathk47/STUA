import { Trip } from "../models/Trip.js";
import Vehicle from "../models/userVehicle.js";
import mongoose from "mongoose";

const getAnalysisSummaryService = async (userId) => {
    const summary = await Trip.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: null,
                totalDistance: { $sum: "$distance" },
                totalEmission: { $sum: "$emission" },
                totalTrips: { $sum: 1 },
                avgEmission: { $avg: "$emission" }
            }
        }
    ]);

    return summary[0] || {
        totalDistance: 0,
        totalEmission: 0,
        totalTrips: 0,
        avgEmission: 0
    };
};

const getModeBreakdownService = async (userId) => {
    const breakdown = await Trip.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: "$mode",
                totalEmission: { $sum: "$emission" },
                count: { $sum: 1 }
            }
        },
        { $sort: { totalEmission: -1 } }
    ]);
    return breakdown;
};

const getEmissionTrendService = async (userId, days = 30) => {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    const trend = await Trip.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                date: { $gte: dateLimit }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                totalEmission: { $sum: "$emission" },
                distance: { $sum: "$distance" }
            }
        },
        { $sort: { _id: 1 } }
    ]);
    return trend;
};

const getVehicleUsageService = async (userId) => {
    // Aggregate trips by vehicleId first
    const vehicleStats = await Trip.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                vehicleId: { $ne: null } // Only user vehicles
            }
        },
        {
            $group: {
                _id: "$vehicleId",
                totalDistance: { $sum: "$distance" },
                totalEmission: { $sum: "$emission" },
                tripCount: { $sum: 1 }
            }
        }
    ]);

    // Populate vehicle details manually or via lookup if needed, 
    // but since we need full vehicle details, let's fetch vehicles and map.
    // Actually $lookup is better.

    const vehicleUsage = await Trip.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                vehicleId: { $exists: true, $ne: null }
            }
        },
        {
            $group: {
                _id: "$vehicleId", // Group by vehicleId
                trips: { $sum: 1 },
                distance: { $sum: "$distance" },
                emission: { $sum: "$emission" }
            }
        },
        {
            $lookup: {
                from: "uservehicles", // Collection name (usually lowercase plural of model name)
                localField: "_id",
                foreignField: "_id",
                as: "vehicleDetails"
            }
        },
        {
            $unwind: {
                path: "$vehicleDetails",
                preserveNullAndEmptyArrays: true // Keep trips even if vehicle lookup fails (for debugging)
            }
        },
        {
            $project: {
                vehicleName: { $ifNull: ["$vehicleDetails.vehicle_name", "Unknown Vehicle"] },
                vehicleModel: { $ifNull: ["$vehicleDetails.vehicle_model", "N/A"] },
                trips: 1,
                distance: 1,
                emission: 1
            }
        }
    ]);

    return vehicleUsage;
};

const getCommunityImpactService = async (userId) => {
    // 1. Calculate savings for ALL users to determine rank
    // Baseline: 0.15 kg CO2 per km (Average Car)
    // Distance assumed to be in meters (Trip model standard)
    const aggregatedData = await Trip.aggregate([
        {
            $group: {
                _id: "$userId",
                totalDistanceMeters: { $sum: "$distance" },
                totalActualEmissions: { $sum: "$emission" }
            }
        },
        {
            $project: {
                _id: 1,
                baselineEmissions: {
                    $multiply: [
                        "$totalDistanceMeters", // Actually KM
                        0.15 // kg CO2 per km (150g)
                    ]
                },
                totalActualEmissions: 1
            }
        },
        {
            $project: {
                _id: 1,
                savedKg: { $subtract: ["$baselineEmissions", "$totalActualEmissions"] }
            }
        },
        { $sort: { savedKg: -1 } }
    ]);

    // 2. Find rank of current user
    console.log("Community Impact Debug - UserID:", userId);
    console.log("Community Impact Debug - Aggregated Data First 3:", aggregatedData.slice(0, 3));

    const userRankIndex = aggregatedData.findIndex(u => u._id && u._id.toString() === userId.toString());
    console.log("Community Impact Debug - Found Index:", userRankIndex);

    const totalUsers = aggregatedData.length;

    let userStats = {
        savedKg: 0,
        percentile: 0,
        tier: "Sustainability Starter",
        message: "Start logging trips to see your impact!"
    };

    if (userRankIndex !== -1) {
        const userData = aggregatedData[userRankIndex];
        // Calculate percentile: Top 1 (index 0) of 100 users = 100th percentile
        const percentile = Math.round(((totalUsers - userRankIndex) / totalUsers) * 100);

        let tier = "Sustainability Starter.  🌱";
        if (percentile >= 90) tier = "Eco Champion 🏆";
        else if (percentile >= 75) tier = "Green Contributor 🌿";
        else if (percentile >= 50) tier = "Conscious Traveler 🚶";

        let message = "Every eco-friendly trip helps!";
        if (percentile >= 90) message = "You're a sustainability leader! Amazing work.";
        else if (percentile >= 75) message = "You're doing great! Keep choosing green modes.";
        else if (percentile >= 50) message = "You're above average! Can you reach the next tier?";
        else if (userData.savedKg > 0) message = "Off to a good start! Try replacing one car trip this week.";

        userStats = {
            savedKg: Math.max(0, parseFloat(userData.savedKg.toFixed(2))),
            percentile,
            tier,
            message
        };
    }

    return userStats;
};

export {
    getAnalysisSummaryService,
    getModeBreakdownService,
    getEmissionTrendService,
    getVehicleUsageService,
    getCommunityImpactService
};
