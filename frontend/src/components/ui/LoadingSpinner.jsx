import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'default', message = 'Loading...' }) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        default: 'w-8 h-8',
        large: 'w-12 h-12'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className={`${sizeClasses[size]} text-emerald-600 animate-spin`} />
            {message && <p className="text-sm text-slate-600">{message}</p>}
        </div>
    );
};

export const LoadingPage = ({ message = 'Loading...' }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <LoadingSpinner size="large" message={message} />
        </div>
    );
};

export default LoadingSpinner;
