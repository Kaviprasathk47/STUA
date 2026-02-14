// Dashboard.jsx - Dynamic dashboard page
import { useEffect, useState } from "react";
import api from "../../services/axios";
import {
  Bike,
  Bus,
  Footprints,
  Car,
  TrendingUp,
  Award,
  MapPin,
  Calendar,
  Trash2,
} from "lucide-react";
import { deleteTrip } from "../../services/travelService";
import toast from "react-hot-toast";
import UserGradeWidget from "../../components/Gamification/UserGradeWidget";

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
  const [selectedTrip, setSelectedTrip] = useState(null);

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteTrip(tripId);
      toast.success("Trip deleted successfully!");
      fetchDashboard(); // Refresh dashboard data
    } catch (error) {
      console.error("Failed to delete trip:", error);
      toast.error(error.response?.data?.message || "Failed to delete trip");
    }
  };

  const RouteModal = ({ trip, onClose }) => {
    if (!trip) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in duration-200 border border-slate-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>

          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            Trip Route Details
          </h3>

          <div className="space-y-6">
            <div className="relative pl-6 border-l-2 border-primary/20 space-y-8">
              {/* Origin Point */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-50"></div>
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1 block">Start Location</span>
                  <p className="font-semibold text-slate-800 text-lg leading-tight">
                    {trip.sourceDisplayName || (trip.source ? trip.source.split(',')[0] : 'Unknown Start')}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {trip.source || 'Address not available'}
                  </p>
                </div>
              </div>

              {/* Destination Point */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-red-500 ring-4 ring-red-50"></div>
                <div>
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1 block">Destination</span>
                  <p className="font-semibold text-slate-800 text-lg leading-tight">
                    {trip.destinationDisplayName || (trip.destination ? trip.destination.split(',')[0] : 'Unknown Destination')}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {trip.destination || 'Address not available'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500 block mb-1">Distance</span>
                <span className="font-semibold text-slate-800">{trip.distance} km</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-1">Transport Mode</span>
                <span className="font-semibold text-slate-800 capitalize">{trip.mode}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  console.log("Dashboard data:", data);
  // Fetch dashboard data
  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setData(res.data);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-600 dark:text-gray-400">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500 dark:text-red-400">{error}</div>;
  }

  // Map backend data → UI structure
  const stats = [
    {
      label: "Total Trips",
      value: data.stats.totalTrips,
      icon: MapPin,
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600",
    },
    {
      label: "Total Distance",
      value: `${data.stats.totalDistance} km`,
      icon: TrendingUp,
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "CO₂ Saved",
      value: `${data.stats.co2Saved} kg`,
      icon: Sprout,
      bgColor: "bg-teal-50 dark:bg-teal-500/10",
      iconColor: "text-teal-600 dark:text-teal-400",
    },
    {
      label: "Sustainability Score",
      value: `${data.stats.score}/10`,
      icon: Award,
      bgColor: "bg-green-50 dark:bg-green-500/10",
      iconColor: "text-green-600 dark:text-green-400",
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome, {data.user.name} 👋
          </h1>
          <p className="text-slate-500">
            Here's how sustainable your travel has been
          </p>
        </div>
      </div>

      {/* Gamification Widget */}
      <UserGradeWidget />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition"
          >
            <div className={`p-3 ${stat.bgColor} rounded-xl w-fit mb-4`}>
              <Icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">
              {stat.value}
            </h3>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>

        })}
      </div>

      {/* Transport Modes */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
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
                    className="h-full bg-emerald-600"
                    style={{ width: `${mode.percentage}%` }}
                  />
                </div>

                <p className="text-xs text-slate-500 mt-1">
                  {mode.trips} trips • {mode.distance} km
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Trips */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4">Recent Trips</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 font-semibold text-slate-500 card-foreground">Date</th>
                <th className="text-left py-2 font-semibold text-slate-500">Mode</th>
                <th className="text-left py-2 font-semibold text-slate-500">Route</th>
                <th className="text-left py-2 font-semibold text-slate-500">Distance</th>
                <th className="text-left py-2 font-semibold text-slate-500">CO₂ (kg)</th>
                <th className="text-left py-2 font-semibold text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.recentTrips.map((trip, index) => (
                <tr key={index} className="border-b border-slate-200 hover:bg-slate-100/50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span>{trip.date}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-500 capitalize">{trip.mode}</td>
                  <td className="py-3">
                    <button
                      onClick={() => setSelectedTrip(trip)}
                      className="text-sm text-emerald-600 font-medium hover:text-emerald-600/80 hover:bg-emerald-600/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <MapPin className="w-4 h-4" />
                      View Details
                    </button>
                  </td>
                  <td className="py-3 text-slate-500">{trip.distance} km</td>
                  <td
                    className={`py-3 font-medium ${trip.co2 < 0 ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                      }`}
                  >
                    {trip.co2}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleDeleteTrip(trip._id)}
                      className="text-sm text-red-600 font-medium hover:text-red-600/80 hover:bg-red-600/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                      title="Delete trip"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Route Modal */}
      {selectedTrip && (
        <RouteModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
