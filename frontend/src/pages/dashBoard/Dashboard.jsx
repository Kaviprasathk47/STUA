// Dashboard.jsx - Dynamic dashboard page
import { useEffect, useState } from "react";
import api from "../../services/axios";
import mock_data from "../../data/data.jsx"; // For mock data during development
import {
  Bike,
  Bus,
  Footprints,
  Car,
  TrendingUp,
  Award,
  MapPin,
  Calendar,
} from "lucide-react";

// Custom Sprout Icon
const Sprout = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M7 20h10" />
    <path d="M10 20c0-4.4-3.6-8-8-8 0 4.4 3.6 8 8 8Z" />
    <path d="M14 20c0-4.4 3.6-8 8-8 0 4.4-3.6 8-8 8Z" />
  </svg>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
console.log("Dashboard data:", data);
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        setData(mock_data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-600">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  // Map backend data → UI structure
  const stats = [
    {
      label: "Total Trips",
      value: data.stats.totalTrips,
      icon: MapPin,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Total Distance",
      value: `${data.stats.totalDistance} km`,
      icon: TrendingUp,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "CO₂ Saved",
      value: `${data.stats.co2Saved} kg`,
      icon: Sprout,
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600",
    },
    {
      label: "Sustainability Score",
      value: `${data.stats.score}/10`,
      icon: Award,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  const iconMap = {
    Bicycle: Bike,
    Bus: Bus,
    Walking: Footprints,
    Car: Car,
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {data.user.name} 👋
        </h1>
        <p className="text-gray-600">
          Here's how sustainable your travel has been
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-lg transition"
            >
              <div className={`p-3 ${stat.bgColor} rounded-xl w-fit mb-4`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Transport Modes */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="text-xl font-bold mb-4">
          Transport Mode Distribution
        </h2>

        <div className="space-y-4">
          {data.transportModes.map((mode) => {
            const Icon = iconMap[mode.name];
            return (
              <div key={mode.name}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-5 h-5" />}
                    <span className="font-medium">{mode.name}</span>
                  </div>
                  <span className="font-semibold">{mode.percentage}%</span>
                </div>

                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${mode.percentage}%` }}
                  />
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {mode.trips} trips • {mode.distance} km
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Trips */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="text-xl font-bold mb-4">Recent Trips</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Mode</th>
                <th className="text-left py-2">Distance</th>
                <th className="text-left py-2">CO₂</th>
              </tr>
            </thead>
            <tbody>
              {data.recentTrips.map((trip, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {trip.date}
                  </td>
                  <td>{trip.mode}</td>
                  <td>{trip.distance} km</td>
                  <td
                    className={
                      trip.co2 < 0 ? "text-green-600" : "text-red-500"
                    }
                  >
                    {trip.co2} kg
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
