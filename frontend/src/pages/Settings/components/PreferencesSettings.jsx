import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/axios';
import { Save, Loader2, CheckCircle, XCircle } from 'lucide-react';

const PreferencesSettings = () => {
    const { user } = useAuth();
    const [preferences, setPreferences] = useState({
        transportMode: 'Car',
        emissionUnit: 'kg',
        distanceUnit: 'km'
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && user.preferences) {
            setPreferences({
                transportMode: user.preferences.transportMode || 'Car',
                emissionUnit: user.preferences.emissionUnit || 'kg',
                distanceUnit: user.preferences.distanceUnit || 'km'
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setPreferences({ ...preferences, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // We need to send the preferences object wrapped in the update payload
            await api.put('/auth/me', { preferences });
            setSuccess('Preferences updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update preferences');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Application Preferences</h2>

            {success && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {success}
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Transport Mode</label>
                    <select
                        name="transportMode"
                        value={preferences.transportMode}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        <option value="Car">Car</option>
                        <option value="Bus">Bus</option>
                        <option value="Train">Train</option>
                        <option value="Motorbike">Motorbike</option>
                        <option value="Bicycle">Bicycle</option>
                        <option value="Walking">Walking</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">This mode will be selected by default when adding new trips.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Emission Unit</label>
                        <select
                            name="emissionUnit"
                            value={preferences.emissionUnit}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        >
                            <option value="kg">Kilograms (kg CO₂)</option>
                            <option value="g">Grams (g CO₂)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Distance Unit</label>
                        <select
                            name="distanceUnit"
                            value={preferences.distanceUnit}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        >
                            <option value="km">Kilometers (km)</option>
                            <option value="mi">Miles (mi)</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Preferences
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PreferencesSettings;
