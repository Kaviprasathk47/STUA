import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Car, Fuel, Calendar, Trash2, Plus, X, Leaf, Edit2 } from "lucide-react";
import { addVehicle, getVehicles, deleteVehicle, updateVehicle } from "../services/vehicleService";
import MicroTip from "./ui/MicroTip";

const VehicleManagement = () => {
    const [vehicles, setVehicles] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingVehicleId, setEditingVehicleId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        vehicle_name: "",
        vehicle_type: "Car",
        vehicle_model: "",
        fuel_type: "Petrol",
        vehicle_manufacture_date: "",
        vehicle_emission_rating: "",
        vehicle_engine_size: "Small",
    });

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const data = await getVehicles();
            setVehicles(data.data || []);
        } catch (error) {
            console.error("Failed to fetch vehicles", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this vehicle?")) {
            try {
                await deleteVehicle(id);
                fetchVehicles();
                toast.success("Vehicle deleted successfully");
            } catch (error) {
                console.error("Failed to delete vehicle", error);
                toast.error("Failed to delete vehicle");
            }
        }
    };

    const handleEdit = (vehicle) => {
        setEditingVehicleId(vehicle._id);
        setFormData({
            vehicle_name: vehicle.vehicle_name,
            vehicle_type: vehicle.vehicle_type,
            vehicle_model: vehicle.vehicle_model,
            fuel_type: vehicle.fuel_type,
            vehicle_manufacture_date: vehicle.vehicle_manufacture_date ? new Date(vehicle.vehicle_manufacture_date).toISOString().split('T')[0] : "",
            vehicle_emission_rating: vehicle.vehicle_emission_rating,
            vehicle_engine_size: vehicle.vehicle_engine_size || "Average", // Default to Average instead of N/A
        });
        setShowAddForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingVehicleId) {
                await updateVehicle(editingVehicleId, formData);
            } else {
                await addVehicle(formData);
            }

            setShowAddForm(false);
            setEditingVehicleId(null);
            setFormData({
                vehicle_name: "",
                vehicle_type: "Car",
                vehicle_model: "",
                fuel_type: "Petrol",
                vehicle_manufacture_date: "",
                vehicle_emission_rating: "",
                vehicle_engine_size: "Small",
            });
            fetchVehicles();
            toast.success(editingVehicleId ? "Vehicle updated successfully!" : "Vehicle added successfully!");
        } catch (error) {
            console.error(editingVehicleId ? "Failed to update vehicle" : "Failed to add vehicle", error);
            // toast.error handled by global interceptor usually, but if not caught there:
            // Since we are catching it here, we should show toast here.
            toast.error(editingVehicleId ? "Failed to update vehicle." : "Failed to add vehicle. Please try again.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const newData = { ...prev, [name]: value };

            // Auto-reset fields if type changes to Cycle
            if (name === "vehicle_type" && (value === "Cycle")) {
                newData.fuel_type = "Human Power";
                newData.vehicle_emission_rating = "0";
                newData.vehicle_engine_size = "N/A";
            }

            // Auto-set engine size for Bike/Scooter
            if (name === "vehicle_type" && (value === "Bike" || value === "Scooter")) {
                newData.vehicle_engine_size = "Average";
            }

            return newData;
        });
    };

    // Calculate available engine sizes based on vehicle type and fuel
    const getEngineSizes = () => {
        if (formData.vehicle_type === "Car") {
            if (["Petrol", "Diesel"].includes(formData.fuel_type)) {
                return ["Small", "Medium", "Large"];
            }
            if (["Hybrid", "Electric"].includes(formData.fuel_type)) {
                return ["Average"];
            }
        }
        if (formData.vehicle_type === "Bike" || formData.vehicle_type === "Scooter") {
            return ["Average"]; // Assuming motorcycles are average in dataset
        }
        return ["N/A"];
    };

    // Update engine size when fuel changes logic (optional but good UX)
    useEffect(() => {
        const sizes = getEngineSizes();
        if (!sizes.includes(formData.vehicle_engine_size)) {
            setFormData(prev => ({ ...prev, vehicle_engine_size: sizes[0] }));
        }
    }, [formData.vehicle_type, formData.fuel_type]);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Car className="w-6 h-6 text-emerald-600" />
                        My Garage
                    </h2>
                    <p className="text-slate-500 text-sm">
                        Manage your vehicles for accurate emission tracking.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingVehicleId(null);
                        setFormData({
                            vehicle_name: "",
                            vehicle_type: "Car",
                            vehicle_model: "",
                            fuel_type: "Petrol",
                            vehicle_manufacture_date: "",
                            vehicle_emission_rating: "",
                            vehicle_engine_size: "Small",
                        });
                        setShowAddForm(true);
                    }}

                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-600/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Vehicle
                </button>
            </div>

            {/* Micro-tip for vehicle management */}
            <MicroTip
                text="Vehicle emissions are calculated using verified datasets—add your vehicles for personalized tracking."
                variant="info"
                className="mb-4"
            />

            {
                loading ? (
                    <div className="text-center py-8 text-slate-500">Loading vehicles...</div>
                ) : vehicles.length === 0 ? (
                    <div className="text-center py-8 bg-slate-100 rounded-xl border border-dashed border-slate-200">
                        <p className="text-slate-500">No vehicles registered yet.</p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="text-emerald-600 font-medium hover:underline mt-2"
                        >
                            Add your first vehicle
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {vehicles.map((vehicle) => (
                            <div
                                key={vehicle._id}
                                className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow relative group bg-white"
                            >
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(vehicle)}
                                        className="text-slate-500 hover:text-emerald-600"
                                        title="Edit vehicle"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(vehicle._id)}
                                        className="text-slate-500 hover:text-red-600"
                                        title="Delete vehicle"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <Car className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">
                                            {vehicle.vehicle_name}
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            {vehicle.vehicle_model}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-slate-800">
                                    <div className="flex items-center gap-2">
                                        <Fuel className="w-4 h-4 text-slate-500" />
                                        <span>{vehicle.fuel_type}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-500" />
                                        <span>
                                            {new Date(
                                                vehicle.vehicle_manufacture_date
                                            ).getFullYear()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Leaf className="w-4 h-4 text-emerald-600" />
                                        <span className="font-medium text-slate-800">
                                            {vehicle.vehicle_emission_rating} g CO₂/km
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500 uppercase font-semibold">Size:</span>
                                        <span className="text-slate-800">{vehicle.vehicle_engine_size || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }

            {/* Add Vehicle Modal */}
            {
                showAddForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade">
                        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 md:p-8 transform transition-all animate-scale-in border border-slate-200">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {editingVehicleId ? "Edit Vehicle" : "Add New Vehicle"}
                                    </h3>
                                    <p className="text-slate-500 text-sm mt-1">
                                        Enter your vehicle details for accurate tracking.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                        Vehicle Name
                                    </label>
                                    <input
                                        type="text"
                                        name="vehicle_name"
                                        required
                                        value={formData.vehicle_name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. My Daily Commuter"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 ring-offset-background focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none transition-all placeholder:text-slate-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                            Type
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="vehicle_type"
                                                value={formData.vehicle_type}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 ring-offset-background focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none transition-all appearance-none"
                                            >
                                                <option value="Car">Car</option>
                                                <option value="Cycle">Cycle</option>
                                                <option value="Bike">Motorbike</option>
                                                <option value="Scooter">Scooter</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                            Fuel
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="fuel_type"
                                                value={formData.fuel_type}
                                                onChange={handleInputChange}
                                                disabled={formData.vehicle_type === "Cycle"}
                                                className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none bg-white ${formData.vehicle_type === "Cycle" ? "bg-slate-100 text-slate-400 cursor-not-allowed" : ""}`}
                                            >
                                                {formData.vehicle_type === "Cycle" ? (
                                                    <option value="Human Power">Human Power</option>
                                                ) : (
                                                    <>
                                                        <option value="Petrol">Petrol</option>
                                                        <option value="Diesel">Diesel</option>
                                                        <option value="Electric">Electric</option>
                                                        <option value="Hybrid">Hybrid</option>
                                                    </>
                                                )}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                            Model
                                        </label>
                                        <input
                                            type="text"
                                            name="vehicle_model"
                                            required
                                            value={formData.vehicle_model}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Toyota Camry"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 ring-offset-background focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none transition-all placeholder:text-slate-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                            Year
                                        </label>
                                        <input
                                            type="date"
                                            name="vehicle_manufacture_date"
                                            required
                                            value={formData.vehicle_manufacture_date}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 ring-offset-background focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                            Engine Size
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="vehicle_engine_size"
                                                value={formData.vehicle_engine_size}
                                                onChange={handleInputChange}
                                                disabled={getEngineSizes().length === 1 && getEngineSizes()[0] === "N/A"}
                                                className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none bg-white ${getEngineSizes().length === 1 && getEngineSizes()[0] === "N/A" ? "bg-slate-100 text-slate-400 cursor-not-allowed" : ""}`}
                                            >
                                                {getEngineSizes().map(size => (
                                                    <option key={size} value={size}>{size}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                            Emission Rating (g CO₂/km)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="vehicle_emission_rating"
                                                required
                                                min="0"
                                                step="0.1"
                                                value={formData.vehicle_emission_rating}
                                                onChange={handleInputChange}
                                                disabled={formData.vehicle_type === "Cycle"}
                                                placeholder={formData.vehicle_type === "Cycle" ? "0" : "0.0"}
                                                className={`w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-500 ${formData.vehicle_type === "Cycle" ? "bg-slate-100 text-slate-400 cursor-not-allowed" : ""}`}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                                <span className="text-slate-400 text-sm font-medium">g/km</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                                            <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                                            <span>Check your vehicle manual or online database.</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="flex-1 py-2.5 bg-slate-100 text-slate-800 rounded-xl font-semibold hover:bg-slate-100/80 transition-colors"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="flex-[2] py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-600/90 transition-colors shadow-lg"
                                    >
                                        {editingVehicleId ? "Update Vehicle" : "Save Vehicle"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div >
                )
            }
        </div >
    );
};

export default VehicleManagement;
