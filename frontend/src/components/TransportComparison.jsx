import React, { useMemo, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Footprints, Bike, Train, Bus, Car, ChevronDown, ChevronUp, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addTravelData } from '../services/travelService';
import { getVehicles } from '../services/vehicleService';
import { calculateEmission } from '../services/emissionService';
import MicroTip from './ui/MicroTip';

const TransportComparison = ({
  distanceMeters,
  durationSeconds,
  origin,
  destination,
  originName,
  destinationName,
  date
}) => {
  const [expandedMode, setExpandedMode] = useState(null);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();
        setVehicles(data.data || []);
      } catch (error) {
        console.error("Failed to fetch vehicles", error);
      }
    };
    fetchVehicles();
  }, []);

  const [calculatedModes, setCalculatedModes] = useState([]);

  useEffect(() => {
    if (!distanceMeters) return;

    const distanceKm = distanceMeters / 1000;

    // Speed estimates (km/h) for duration calculation
    const SPEEDS = {
      walking: 5,
      cycling: 15,
      bicycle: 15,
      train: 80,
      bus: 40,
      car: 60,
      motorcycle: 60,
      motorbike: 60,
    };

    const calculateDuration = (mode) => {
      if (mode === 'car') return durationSeconds; // Use Google Maps duration for car
      const speed = SPEEDS[mode] || 60;
      const hours = distanceKm / speed;
      return Math.round(hours * 3600); // Convert to seconds
    };

    const formatDuration = (seconds) => {
      if (!seconds || isNaN(seconds)) return "N/A";
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    };

    const fetchEmissions = async () => {
      // 1. Standard Modes
      const standardModes = ['walking', 'bicycle', 'train', 'bus'];

      const standardResults = await Promise.all(standardModes.map(async (mode) => {
        try {
          // Standard modes don't have vehicle IDs
          const response = await calculateEmission({
            mode,
            distance: distanceKm
          });

          const { totalEmissionKg } = response.data;

          const modeConfig = {
            walking: { icon: Footprints, name: 'Walking', color: 'text-emerald-600', bg: 'bg-emerald-100', cat: 'Eco-friendly', catColor: 'text-emerald-700 bg-emerald-100' },
            bicycle: { icon: Bike, name: 'Bicycle', color: 'text-emerald-600', bg: 'bg-emerald-100', cat: 'Eco-friendly', catColor: 'text-emerald-700 bg-emerald-100' },
            train: { icon: Train, name: 'Train', color: 'text-blue-600', bg: 'bg-blue-100', cat: 'Low Emission', catColor: 'text-blue-700 bg-blue-100' },
            bus: { icon: Bus, name: 'Bus', color: 'text-amber-600', bg: 'bg-amber-100', cat: 'Moderate', catColor: 'text-amber-700 bg-amber-100' }
          };

          const config = modeConfig[mode];

          // Speed mapping
          let speedMode = mode;
          if (mode === 'bicycle') speedMode = 'cycling';

          return {
            id: mode,
            name: config.name,
            icon: config.icon,
            color: config.color,
            bg: config.bg,
            emission: totalEmissionKg,
            duration: calculateDuration(speedMode),
            category: config.cat,
            categoryColor: config.catColor,
            formattedDuration: formatDuration(calculateDuration(speedMode)),
            formattedEmission: totalEmissionKg.toFixed(2),
            formattedDistance: distanceKm.toFixed(1),
            type: 'standard'
          };
        } catch (error) {
          console.error(`Error calculating emission for ${mode}:`, error);
          return null;
        }
      }));

      // 2. User Vehicles
      // Only process vehicles that are SELECTED
      const selectedVehicles = vehicles.filter(v => selectedVehicleIds.includes(v._id));

      const vehicleResults = await Promise.all(selectedVehicles.map(async (vehicle) => {
        try {
          let apiMode = 'car';
          if (['Bike', 'Scooter', 'Motorcycle', 'Motorbike'].includes(vehicle.vehicle_type)) {
            apiMode = 'motorcycle';
          } else if (vehicle.vehicle_type === 'Cycle') {
            apiMode = 'bicycle';
          }

          const response = await calculateEmission({
            mode: apiMode,
            distance: distanceKm,
            vehicleDetails: vehicle._id
          });

          const { totalEmissionKg } = response.data;
          const Icon = (apiMode === 'motorcycle' || apiMode === 'bicycle') ? Bike : Car; // Fallback icon

          // Classify sustainability
          let cat = 'High Emission';
          let catColor = 'text-red-700 bg-red-100';
          if (apiMode === 'bicycle') {
            cat = 'Eco-friendly'; catColor = 'text-emerald-700 bg-emerald-100';
          } else if (totalEmissionKg < 0.5) {
            cat = 'Low Emission'; catColor = 'text-blue-700 bg-blue-100';
          } else if (totalEmissionKg < 2.0) {
            cat = 'Moderate'; catColor = 'text-amber-700 bg-amber-100';
          }

          return {
            id: vehicle._id,
            name: vehicle.vehicle_name,
            icon: Icon,
            color: apiMode === 'bicycle' ? 'text-emerald-600' : (apiMode === 'motorcycle' ? 'text-orange-600' : 'text-red-600'),
            bg: apiMode === 'bicycle' ? 'bg-emerald-100' : (apiMode === 'motorcycle' ? 'bg-orange-100' : 'bg-red-100'),
            emission: totalEmissionKg,
            duration: calculateDuration(apiMode),
            category: cat,
            categoryColor: catColor,
            formattedDuration: formatDuration(calculateDuration(apiMode)),
            formattedEmission: totalEmissionKg.toFixed(2),
            formattedDistance: distanceKm.toFixed(1),
            type: 'vehicle',
            vehicleId: vehicle._id, // Store for logging
            apiMode: apiMode
          };

        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || "Failed to calculate";
          console.error(`Error calculating emission for vehicle ${vehicle.vehicle_name}:`, error);
          return {
            id: vehicle._id,
            name: vehicle.vehicle_name,
            icon: Car,
            color: 'text-gray-400',
            bg: 'bg-gray-100',
            emission: null,
            duration: 0,
            formattedEmission: 'Error',
            formattedDuration: 'N/A',
            error: errorMessage
          };
        }
      }));

      const allResults = [...standardResults, ...vehicleResults].filter(r => r !== null);
      setCalculatedModes(allResults);
    };

    fetchEmissions();
  }, [distanceMeters, durationSeconds, selectedVehicleIds, vehicles]);

  const transportModes = useMemo(() => {
    return calculatedModes.sort((a, b) => {
      if (a.emission === null) return 1;
      if (b.emission === null) return -1;
      return a.emission - b.emission;
    });
  }, [calculatedModes]);

  const toggleExpand = (id) => {
    setExpandedMode(expandedMode === id ? null : id);
  };

  const toggleVehicleSelection = (vehicleId) => {
    setSelectedVehicleIds(prev => {
      if (prev.includes(vehicleId)) {
        return prev.filter(id => id !== vehicleId);
      } else {
        return [...prev, vehicleId];
      }
    });
  };

  const navigate = useNavigate();
  const [isLogging, setIsLogging] = useState(false);

  const handleSelectMode = async (mode) => {
    if (isLogging) return;
    setIsLogging(true);
    try {
      // Map mode name to backend expected enum
      let backendMode = 'Car'; // Default

      if (mode.type === 'vehicle') {
        // Map apiMode (car, motorcycle, bicycle) to backend Enum
        if (mode.apiMode === 'bicycle') backendMode = 'Cycle';
        else if (mode.apiMode === 'motorcycle') backendMode = 'Bike';
        else backendMode = 'Car';
      } else {
        // Standard modes (walking, bicycle, train, bus)
        if (mode.id === 'walking') backendMode = 'Walk';
        else if (mode.id === 'bicycle') backendMode = 'Cycle';
        else if (mode.id === 'train') backendMode = 'Train';
        else if (mode.id === 'bus') backendMode = 'Bus';
      }

      const tripData = {
        mode: backendMode,
        distance: parseFloat(mode.formattedDistance),
        emission: parseFloat(mode.formattedEmission),
        source: origin.address || origin, // origin might be object or string
        destination: destination.address || destination,
        sourceDisplayName: originName,
        destinationDisplayName: destinationName,
        vehicleId: mode.type === 'vehicle' ? mode.vehicleId : undefined,
        date: date
      };

      await addTravelData(tripData);
      toast.success('Trip logged successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to log trip:', error);
      toast.error('Failed to log trip. Please try again.');
    } finally {
      setIsLogging(false);
    }
  };

  if (!distanceMeters) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
      <div className="p-6 border-b border-slate-200/50">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-500" />
              Transport Mode Comparison
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Compare carbon footprints for your {Math.floor(distanceMeters / 1000)} km journey from {originName || origin} to {destinationName || destination}.
            </p>
          </div>

          {/* Micro-tip for transport comparison */}
          <MicroTip
            text="Walking and cycling produce zero CO₂ for short trips, while public transport emits significantly less per person."
            variant="success"
            className="mt-2"
          />

          {/* User Vehicles Section */}
          {vehicles.length > 0 && (
            <div className="bg-slate-100/50 rounded-xl p-4 border border-slate-200/50">
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Car className="w-4 h-4 text-slate-500" />
                Compare Your Vehicles
              </h3>
              {/* Micro-tip for vehicle selection */}
              <MicroTip
                text="Select your vehicle to get accurate CO₂ estimates based on verified datasets."
                variant="info"
                className="mb-3"
              />
              <div className="flex flex-wrap gap-3">
                {vehicles.map(v => {
                  const isSelected = selectedVehicleIds.includes(v._id);
                  return (
                    <button
                      key={v._id}
                      onClick={() => toggleVehicleSelection(v._id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${isSelected
                        ? 'bg-blue-500/60 text-emerald-600-foreground border-primary shadow-sm'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-200/80'
                        }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-100-foreground'}`}></span>
                      {v.vehicle_name}
                      <span className={`text-xs ${isSelected ? 'text-emerald-600-foreground/80' : 'text-slate-500'}`}>
                        ({v.vehicle_emission_rating} g/km)
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {vehicles.length === 0 && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-amber-800 text-sm">
              Add a vehicle in <strong>My Garage</strong> to compare it here.
            </div>
          )}
        </div>
      </div>

      <div className="divide-y divide-border/50">
        {transportModes.map((mode, index) => {
          const isBestOption = index === 0;
          const Icon = mode.icon;
          const isExpanded = expandedMode === mode.id;

          return (
            <div
              key={mode.id}
              className={`transition-colors hover:bg-slate-100/50 ${isExpanded ? 'bg-slate-100/50' : ''}`}
            >
              <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(mode.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${mode.bg}`}>
                    <Icon className={`w-6 h-6 ${mode.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-800">{mode.name}</h3>
                      {mode.type === 'vehicle' && <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Owner</span>}
                      {isBestOption && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Top Pick
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-0.5">
                      <span className="font-medium text-slate-700">{mode.formattedEmission} kg CO₂</span>
                      <span>•</span>
                      <span>{mode.formattedDuration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`hidden sm:block text-xs font-medium px-2.5 py-1 rounded-full ${mode.categoryColor}`}>
                    {mode.category}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 sm:px-16 sm:pb-6">
                  <div className="bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="block text-slate-500 mb-1">Estimated Emission</span>
                      <span className="font-semibold text-slate-800 text-lg">{mode.formattedEmission} <span className="text-sm font-normal text-slate-500">kg CO₂</span></span>
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-1">Travel Time</span>
                      <span className="font-semibold text-slate-800 text-lg">{mode.formattedDuration}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-1">Distance</span>
                      <span className="font-semibold text-slate-800 text-lg">{mode.formattedDistance} <span className="text-sm font-normal text-slate-500">km</span></span>
                    </div>
                    <div className="sm:col-span-3 pt-2 border-t border-slate-200/50 mt-2 flex justify-between items-center">
                      <div className="flex flex-col">
                        <p className="text-xs text-slate-500">
                          * Estimation based on average {mode.name.toLowerCase()} speeds and {mode.type === 'vehicle' ? 'your vehicle emission factors.' : 'standard emission factors.'}
                        </p>
                        {mode.error && (
                          <p className="text-xs text-red-500 font-medium mt-1">
                            Error: {mode.error}
                          </p>
                        )}
                      </div>
                      {/* Micro-tip for saving trip */}
                      <div className="flex flex-col gap-2 items-end">
                        <MicroTip
                          text="Saving trips helps unlock personalized sustainability insights."
                          variant="success"
                          className="text-right"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectMode(mode);
                          }}
                          disabled={isLogging || mode.error}
                          className="px-4 py-2 bg-blue-200 text-blue-500-foreground text-sm font-semibold rounded-lg hover:bg-blue-600/90 transition-colors disabled:opacity-50"
                        >
                          {isLogging ? 'Logging...' : 'I used this mode'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransportComparison;
