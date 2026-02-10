import { Lightbulb } from 'lucide-react';

const Insights = ({ summary, modeData }) => {
    if (!summary) return null;

    const insights = [];

    // Generate basic insights based on data
    if (summary.totalEmission > 100) {
        insights.push("Your total emissions are high. Consider using public transport more often.");
    } else {
        insights.push("Great job! Your emissions are relatively low.");
    }

    const carData = modeData.find(m => m._id === 'car' || m._id === 'Car');
    if (carData && carData.count > 5) {
        insights.push("You use your car frequently. Carpooling could save up to 50% of emissions.");
    }

    const activeTransport = modeData.filter(m => ['Walking', 'Cycling', 'Bike'].includes(m._id));
    const activeCount = activeTransport.reduce((acc, curr) => acc + curr.count, 0);

    if (activeCount > 0) {
        insights.push(`You made ${activeCount} eco-friendly trips (Walking/Cycling). Keep it up!`);
    }

    return (
        <div className="bg-linear-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white h-full relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-6 h-6 text-yellow-300" />
                    <h3 className="text-lg font-bold">Sustainability Insights</h3>
                </div>
                <ul className="space-y-4">
                    {insights.length > 0 ? (
                        insights.map((insight, index) => (
                            <li key={index} className="flex gap-3 text-sm font-medium opacity-90">
                                <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full mt-1.5 shrink-0"></span>
                                {insight}
                            </li>
                        ))
                    ) : (
                        <li className="text-sm opacity-90">Start tracking trips to get personalized insights!</li>
                    )}
                </ul>
            </div>

            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-yellow-300 opacity-10 rounded-full blur-2xl"></div>
        </div>
    );
};

export default Insights;
