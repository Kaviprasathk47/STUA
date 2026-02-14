import UserGrade from "../models/userGrades.js";

const MODE_MULTIPLIERS = {
    "Walk": 10,
    "Bicycle": 10,
    "Bus": 5,
    "Train": 5,
    "Metro": 5,
    "Tram": 5,
    "EV": 3,
    "Carpool": 3,
    "Car": 0,
    "Motorbike": 0,
    "Flight": 0
};

const getRandomNumber = () => {
    return Math.floor(Math.random() * 25) + 1;
}

const POINTS_TO_MOTIVATION = (number) => {
    switch (number) {
        case 1: return "You're off to a great start! Keep it up!";
        case 2: return "You're doing great! Keep it up!";
        case 3: return "You're doing great! Keep it up!";
        case 4: return "Great Job..!";
        case 5: return "Keep it up..!";
        case 6: return " Every sustainable trip is a step toward a cleaner planet.";
        case 7: return "Small travel choices create big environmental impact.";
        case 8: return "Choose smarter routes, not just faster ones.";
        case 9: return "Your journey matters — for you and the planet.";
        case 10: return "Reducing emissions starts with everyday decisions.";
        case 11: return "Travel light on the Earth, travel strong in impact.";
        case 12: return "Sustainability begins the moment you move.";
        case 13: return "One eco-friendly trip can inspire many more.";
        case 14: return "Cleaner transport today means healthier cities tomorrow.";
        case 15: return "Every kilometer saved is a win for the environment.";
        case 16: return "Your travel choices shape the world you live in.";
        case 17: return "Sustainable journeys lead to sustainable futures.";
        case 18: return "Think beyond distance — think about impact.";
        case 19: return "The greenest route is often the smartest one.";
        case 20: return "Better transport choices build a better planet.";
        case 21: return "Every low-carbon trip counts.";
        case 22: return "Travel responsibly, inspire change silently.";
        case 23: return "You’re not just moving — you’re making a difference.";
        case 24: return "Progress begins with conscious travel.";
        case 25: return "Choose sustainability, one trip at a time.";
        default: return "Let's Build an Empire....";
    }
}

const calculateTripPoints = (mode, distance) => {
    const multiplier = MODE_MULTIPLIERS[mode] || 0;
    return Math.round(distance * multiplier);
};

const updateUserGrade = async (userId, mode, distance) => {
    try {
        const pointsEarned = calculateTripPoints(mode, distance);

        if (pointsEarned === 0) return null; // No points for high emission modes

        // Use UserGrade (capitalized) for model, userGrade (lowercase) for document
        let userGrade = await UserGrade.findOne({ userId });
        let motivation = POINTS_TO_MOTIVATION(getRandomNumber());

        if (!userGrade) {
            userGrade = new UserGrade({
                userId,
                grade: pointsEarned,
                motivation: motivation,
            });
        } else {
            userGrade.grade += pointsEarned;
            // Update motivation on new trip too? Or keep old? 
            // The prompt implies updating motivation.
            userGrade.motivation = motivation;
        }

        await userGrade.save();
        console.log("Updated user grade:", userGrade);
        return { userGrade, pointsEarned };
    } catch (error) {
        console.error("Error updating user grade:", error);
        throw error;
    }
};

const getUserGrade = async (userId) => {
    try {
        const userGrade = await UserGrade.findOne({ userId });
        // Return object with grade and motivation if needed, but original code returned grade number.
        // Wait, controller expects object structure { grade: ... } or just returns grade?
        // Controller: const grade = await ...; res.json({data: {grade}})
        // If I change return to object { grade, motivation }, controller needs update.
        // User changed context to expect motivation.
        // Let's return the whole object or partial.
        if (userGrade) {
            return { grade: userGrade.grade, motivation: userGrade.motivation };
        }
        return { grade: 0, motivation: "Start your journey!" };
    } catch (error) {
        console.error("Error fetching user grade:", error);
        throw error;
    }
};

const getLeaderboard = async () => {
    try {
        const leaderboard = await UserGrade.find()
            .sort({ grade: -1 })
            .limit(10)
            .populate('userId', 'name userName');
        return leaderboard;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        throw error;
    }
};

export const userGradeService = {
    calculateTripPoints,
    updateUserGrade,
    getUserGrade,
    getLeaderboard
};
