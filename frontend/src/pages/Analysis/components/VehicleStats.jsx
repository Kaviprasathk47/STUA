import { Car, Fuel } from 'lucide-react';

const VehicleStats = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Performance</h3>
                <div className="flex items-center justify-center h-40">
                    <p className="text-gray-400">No vehicle usage recorded.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Vehicle Performance</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                            <th className="pb-3 pl-4">Vehicle</th>
                            <th className="pb-3">Trips</th>
                            <th className="pb-3">Distance</th>
                            <th className="pb-3">Total CO₂</th>
                            <th className="pb-3">Efficiency</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.map((vehicle) => (
                            <tr key={vehicle._id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 pl-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Car className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{vehicle.vehicleName}</p>
                                            <p className="text-xs text-gray-500">{vehicle.vehicleModel}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 text-gray-600 font-medium">{vehicle.trips}</td>
                                <td className="py-4 text-gray-600">{vehicle.distance.toFixed(1)} km</td>
                                <td className="py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                                        {vehicle.emission.toFixed(1)} kg
                                    </span>
                                </td>
                                <td className="py-4 text-gray-600 text-sm">
                                    {(vehicle.emission / vehicle.distance).toFixed(3)} kg/km
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VehicleStats;
