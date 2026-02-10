import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TransportComparison from '../../components/TransportComparison';
import { ArrowLeft } from 'lucide-react';

const TransportComparisonPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        distanceMeters,
        durationSeconds,
        origin,
        destination,
        originName,
        destinationName,
        date
    } = location.state || {};

    if (!distanceMeters || !durationSeconds) {
        // Redirect back to trips if data is missing (e.g., direct access)
        // navigate('/trips'); // Commented out to prevent loops during dev, better to show message
        return (
            <div className="p-8 text-center text-slate-500">
                <p>No trip details found. Please search for a trip first.</p>
                <button
                    onClick={() => navigate('/trips')}
                    className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg"
                >
                    Back to Search
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/trips')}
                className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors mb-4"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Trips
            </button>

            <div>
                <h1 className="text-2xl font-bold text-slate-800">Route Analysis</h1>
                <p className="text-slate-600">Comparison of transport modes for your journey.</p>
            </div>

            <TransportComparison
                distanceMeters={distanceMeters}
                durationSeconds={durationSeconds}
                origin={origin}
                destination={destination}
                originName={originName || origin}
                destinationName={destinationName || destination}
                date={date}
            />
        </div>
    );
};

export default TransportComparisonPage;
