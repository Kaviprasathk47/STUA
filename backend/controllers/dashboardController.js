import travel_details from "../models/travel_data.js";
import User from "../models/User.js";

const getDashboardData = async (req, res) => {
    try {
        const userId = req.user; // Assumes protect middleware attaches user ID to req.user

        // Fetch user details
        const user = await User.findById(userId).select("name");

        // If user not found, we might still want to return stats if they exist, or just return basic info
        // But better to handle it gracefully.
        const userName = user ? user.name : "Traveler";

        // Fetch all trips for the user
        const trips = await travel_details.find({ userId }).sort({ data: -1 }).populate("tripId");

        // Calculate stats
        const totalTrips = trips.length;
        const totalDistance = trips.reduce((acc, trip) => acc + (trip.distance_travelled_km || 0), 0);
        const totalEmission = trips.reduce((acc, trip) => acc + (trip.data_travelled_co2 || 0), 0);

        // Baseline emission (using car as baseline: ~0.192 kg/km)
        const BASELINE_EMISSION_FACTOR = 0.192;
        const baselineEmission = totalDistance * BASELINE_EMISSION_FACTOR;
        const co2Saved = Math.max(0, baselineEmission - totalEmission);

        // Sustainability Score (0-10)
        // If co2Saved is high relative to baseline, score is high.
        // Score = (co2Saved / baselineEmission) * 10
        // If baseline is 0, score is 0.
        const score = baselineEmission > 0 ? Math.min(10, Math.round((co2Saved / baselineEmission) * 10)) : 0;

        // Transport Mode Distribution
        const modeStats = trips.reduce((acc, trip) => {
            const mode = trip.mode || "Unknown";
            if (!acc[mode]) {
                acc[mode] = { count: 0, distance: 0 };
            }
            acc[mode].count += 1;
            acc[mode].distance += trip.distance_travelled_km || 0;
            return acc;
        }, {});

        const transportModes = Object.keys(modeStats).map(mode => ({
            name: mode.charAt(0).toUpperCase() + mode.slice(1), // Capitalize
            percentage: totalTrips > 0 ? Math.round((modeStats[mode].count / totalTrips) * 100) : 0,
            trips: modeStats[mode].count,
            distance: modeStats[mode].distance.toFixed(1)
        }));

        // Recent Trips (Top 5)
        const recentTrips = trips.slice(0, 5).map(trip => ({
            date: new Date(trip.data).toLocaleDateString(),
            mode: trip.mode ? trip.mode.charAt(0).toUpperCase() + trip.mode.slice(1) : "Unknown",
            distance: (trip.distance_travelled_km || 0).toFixed(1),
            co2: (trip.data_travelled_co2 || 0).toFixed(2),
            source: (trip.tripId && trip.tripId.source) || "-",
            destination: (trip.tripId && trip.tripId.destination) || "-"
        }));

        res.status(200).json({
            stats: {
                totalTrips,
                totalDistance: totalDistance.toFixed(1),
                co2Saved: co2Saved.toFixed(1),
                score
            },
            user: {
                name: userName
            },
            transportModes,
            recentTrips
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export { getDashboardData };
