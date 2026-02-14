import { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Navigation, AlertCircle, Loader2 } from 'lucide-react';
import { calculateEmission } from '../services/emissionService';
import { getVehicles } from '../services/vehicleService';
import { updateTrip } from '../services/travelService';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

const EditTripModal = ({ trip, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        source: trip?.tripId?.source || '',
        sourceDisplayName: trip?.tripId?.sourceDisplayName || '',
        destination: trip?.tripId?.destination || '',
        destinationDisplayName: trip?.tripId?.destinationDisplayName || '',
        mode: trip?.mode || '',
        vehicleId: trip?.vehicleId?._id || null,
    });

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [calculatedData, setCalculatedData] = useState({
        distance: trip?.distance_travelled_km || 0,
        emission: trip?.data_travelled_co2 || 0,
    });

    // Load user vehicles
    useEffect(() => {
        const loadVehicles = async () => {
            try {
                const response = await getVehicles();
                setVehicles(response.data || []);
            } catch (error) {
                console.error('Failed to load vehicles:', error);
            }
        };
        loadVehicles();
    }, []);

    // Check Google Maps API availability
    useEffect(() => {
        if (!window.google || !window.google.maps) {
            console.warn('Google Maps API not loaded');
            toast.error('Google Maps API not loaded. Distance calculation may fail. Please refresh the page.', {
                duration: 5000,
            });
        }
    }, []);

    // Check if form has changes
    useEffect(() => {
        const changed =
            formData.source !== (trip?.tripId?.source || '') ||
            formData.destination !== (trip?.tripId?.destination || '') ||
            formData.mode !== (trip?.mode || '') ||
            formData.vehicleId !== (trip?.vehicleId?._id || null);
        setHasChanges(changed);
    }, [formData, trip]);

    // Recalculate distance and emissions when relevant fields change
    useEffect(() => {
        const recalculate = async () => {
            if (!formData.source || !formData.destination || !formData.mode) {
                return;
            }

            setCalculating(true);
            try {
                // Check if Google Maps API is loaded
                if (!window.google || !window.google.maps) {
                    throw new Error('Google Maps API not loaded. Please refresh the page.');
                }

                // Calculate distance using Google Maps API
                const service = new window.google.maps.DistanceMatrixService();
                const result = await new Promise((resolve, reject) => {
                    service.getDistanceMatrix(
                        {
                            origins: [formData.source],
                            destinations: [formData.destination],
                            travelMode: window.google.maps.TravelMode.DRIVING,
                        },
                        (response, status) => {
                            if (status === 'OK') {
                                resolve(response);
                            } else {
                                reject(new Error(`Google Maps error: ${status}`));
                            }
                        }
                    );
                });

                // Validate the distance result
                const element = result.rows[0]?.elements[0];
                if (!element || element.status !== 'OK') {
                    throw new Error('Could not calculate distance. Please check the addresses.');
                }

                const distanceMeters = element.distance?.value;
                if (!distanceMeters) {
                    throw new Error('Invalid distance data received');
                }

                const distanceKm = distanceMeters / 1000;

                // Calculate emission
                const emissionData = await calculateEmission({
                    mode: formData.mode,
                    distance: distanceKm,
                    vehicleId: formData.vehicleId,
                });

                // Validate emission data
                if (!emissionData || emissionData.emission === undefined) {
                    throw new Error('Failed to calculate emissions');
                }

                setCalculatedData({
                    distance: distanceKm,
                    emission: emissionData.emission,
                });
            } catch (error) {
                console.error('Recalculation failed:', error);

                // Show more specific error messages
                let errorMessage = 'Failed to recalculate distance and emissions';
                if (error.message.includes('Google Maps')) {
                    errorMessage = error.message;
                } else if (error.message.includes('addresses')) {
                    errorMessage = 'Invalid addresses. Please enter valid locations.';
                } else if (error.message.includes('emissions')) {
                    errorMessage = 'Failed to calculate emissions. Please try again.';
                }

                toast.error(errorMessage);

                // Keep the original values if recalculation fails
                setCalculatedData({
                    distance: trip?.distance_travelled_km || 0,
                    emission: trip?.data_travelled_co2 || 0,
                });
            } finally {
                setCalculating(false);
            }
        };

        if (hasChanges) {
            recalculate();
        }
    }, [formData.source, formData.destination, formData.mode, formData.vehicleId, hasChanges, trip]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!hasChanges) {
            toast.error('No changes detected');
            return;
        }

        setShowConfirmation(true);
    };

    const confirmUpdate = async () => {
        setLoading(true);
        try {
            await updateTrip(trip.tripId._id, {
                source: formData.source,
                sourceDisplayName: formData.sourceDisplayName || formData.source,
                destination: formData.destination,
                destinationDisplayName: formData.destinationDisplayName || formData.destination,
                mode: formData.mode,
                vehicleId: formData.vehicleId,
                distance: calculatedData.distance,
                emission: calculatedData.emission,
            });

            toast.success('Trip updated successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to update trip:', error);
            toast.error(error.response?.data?.message || 'Failed to update trip');
        } finally {
            setLoading(false);
            setShowConfirmation(false);
        }
    };

    const transportModes = [
        { value: 'Car', label: 'Car', icon: '🚗' },
        { value: 'Bus', label: 'Bus', icon: '🚌' },
        { value: 'Train', label: 'Train', icon: '🚆' },
        { value: 'Bike', label: 'Bike', icon: '🚴' },
        { value: 'Walk', label: 'Walk', icon: '🚶' },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-emerald-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Edit Trip</h2>
                            <p className="text-white/80 text-sm mt-1">
                                Update trip details - emissions will be recalculated automatically
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Close modal"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white">
                    {/* Source */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Source Location
                        </label>
                        <input
                            type="text"
                            name="source"
                            value={formData.source}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-slate-50 text-slate-800"
                            placeholder="Enter source location"
                            required
                        />
                    </div>

                    {/* Destination */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                            <Navigation className="w-4 h-4 inline mr-1" />
                            Destination Location
                        </label>
                        <input
                            type="text"
                            name="destination"
                            value={formData.destination}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-slate-50 text-slate-800"
                            placeholder="Enter destination location"
                            required
                        />
                    </div>

                    {/* Transport Mode */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Transport Mode
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {transportModes.map((mode) => (
                                <button
                                    key={mode.value}
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, mode: mode.value }))}
                                    className={`p-4 rounded-xl border-2 transition-all ${formData.mode === mode.value
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                        : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{mode.icon}</div>
                                    <div className="text-sm font-medium">{mode.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Vehicle Selection (if mode is Car) */}
                    {formData.mode === 'Car' && vehicles.length > 0 && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Select Your Vehicle
                            </label>
                            <select
                                name="vehicleId"
                                value={formData.vehicleId || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            >
                                <option value="">Default Car Emission</option>
                                {vehicles.map((vehicle) => (
                                    <option key={vehicle._id} value={vehicle._id}>
                                        {vehicle.vehicle_name} ({vehicle.vehicle_type})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Calculated Values Display */}
                    {calculating && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                            <span className="text-sm text-blue-700">Recalculating distance and emissions...</span>
                        </div>
                    )}

                    {!calculating && hasChanges && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                                <AlertCircle className="w-5 h-5" />
                                Recalculated Values
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <div className="text-xs text-slate-600">Distance</div>
                                    <div className="text-lg font-bold text-slate-800">
                                        {calculatedData.distance.toFixed(2)} km
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-600">CO₂ Emission</div>
                                    <div className="text-lg font-bold text-slate-800">
                                        {calculatedData.emission.toFixed(2)} kg
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-600 mt-2">
                                ℹ️ Trip emissions are recalculated automatically when details are edited.
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-slate-200 text-slate-800 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!hasChanges || calculating || loading}
                            className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update Trip'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-amber-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Confirm Update</h3>
                        </div>
                        <p className="text-slate-600 mb-6">
                            Editing this trip will update emission analysis and recalculate all related data. Are you sure you want to continue?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmUpdate}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Yes, Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

EditTripModal.propTypes = {
    trip: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export default EditTripModal;
