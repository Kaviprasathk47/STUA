import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/axios';
import SummaryCards from './components/SummaryCards';
import ModeBreakdownChart from './components/ModeBreakdownChart';
import EmissionTrendChart from './components/EmissionTrendChart';
import VehicleStats from './components/VehicleStats';
import Insights from './components/Insights';
import CommunityImpact from './components/CommunityImpact';
import { Loader2 } from 'lucide-react';

const AnalysisPage = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [modeData, setModeData] = useState([]);
    const [trendData, setTrendData] = useState([]);
    const [vehicleData, setVehicleData] = useState([]);
    const [impactData, setImpactData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState(30);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [summaryRes, modeRes, trendRes, vehicleRes, impactRes] = await Promise.all([
                    api.get('/analysis/summary'),
                    api.get('/analysis/mode-breakdown'),
                    api.get(`/analysis/trend?days=${timeRange}`),
                    api.get('/analysis/vehicle-usage'),
                    api.get('/analysis/impact')
                ]);

                setSummary(summaryRes.data.data);
                setModeData(modeRes.data.data);
                setTrendData(trendRes.data.data);
                setVehicleData(vehicleRes.data.data);
                setImpactData(impactRes.data.data);
            } catch (err) {
                console.error("Error fetching analysis data:", err);
                const msg = err.response?.data?.message || err.message || "Failed to load analysis data.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [timeRange]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-600">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Sustainability Analysis</h1>
                <p className="text-gray-600">Track and understand your environmental impact.</p>
            </div>

            {/* Community Impact Section */}
            <div className="mb-8">
                <CommunityImpact data={impactData} />
            </div>

            {/* Summary Section */}
            <SummaryCards data={summary} />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ModeBreakdownChart data={modeData} />
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Emission Trend</h3>
                        <div className="relative">
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(Number(e.target.value))}
                                className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 pr-8"
                            >
                                <option value={7}>Last 7 Days</option>
                                <option value={30}>Last 30 Days</option>
                                <option value={90}>Last 3 Months</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                    <EmissionTrendChart data={trendData} />
                </div>
            </div>

            {/* Vehicle Stats & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <VehicleStats data={vehicleData} />
                </div>
                <div className="lg:col-span-1">
                    <Insights summary={summary} modeData={modeData} />
                </div>
            </div>

            <footer className="text-center text-xs text-gray-400 mt-12">
                All emissions shown are calculated using recorded trip data and verified emission factors.
            </footer>
        </div>
    );
};

export default AnalysisPage;
