import { Leaf, Ruler, Footprints, Info } from 'lucide-react';

const SummaryCards = ({ data }) => {
    if (!data) return null;

    const cards = [
        {
            title: "Total CO₂ Emitted",
            value: `${data.totalEmission.toFixed(2)} kg`,
            icon: <Leaf className="w-8 h-8 text-green-500" />,
            color: "bg-green-50 border-green-200"
        },
        {
            title: "Total Distance",
            value: `${data.totalDistance.toFixed(2)} km`,
            icon: <Ruler className="w-8 h-8 text-blue-500" />,
            color: "bg-blue-50 border-blue-200"
        },
        {
            title: "Avg CO₂ / Trip",
            value: `${data.avgEmission.toFixed(2)} kg`,
            icon: <Info className="w-8 h-8 text-purple-500" />,
            color: "bg-purple-50 border-purple-200"
        },
        {
            title: "Total Trips",
            value: data.totalTrips,
            icon: <Footprints className="w-8 h-8 text-orange-500" />,
            color: "bg-orange-50 border-orange-200"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
                <div key={index} className={`p-6 rounded-2xl border ${card.color} shadow-xs transition-transform hover:scale-105`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">{card.title}</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{card.value}</h3>
                        </div>
                        <div className="p-3 bg-white rounded-xl shadow-xs">
                            {card.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
