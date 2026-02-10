import React from 'react';
import { Trophy, Users, Award, Leaf } from 'lucide-react';

const CommunityImpact = ({ data }) => {
    if (!data) return null;

    const { savedKg, tier, message, percentile } = data;

    // Determine colors based on tier
    let gradient = "from-emerald-500 to-teal-600";
    let iconColor = "text-emerald-100";

    if (tier.includes("Gold") || tier.includes("Champion")) {
        gradient = "from-yellow-500 to-amber-600";
        iconColor = "text-yellow-100";
    } else if (tier.includes("Silver") || tier.includes("Contributor")) {
        gradient = "from-slate-400 to-slate-500";
        iconColor = "text-slate-100";
    }

    return (
        <div className={`bg-gradient-to-r ${gradient} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden`}>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Left: Stats */}
                <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <Award className={`w-5 h-5 ${iconColor}`} />
                        <span className="text-sm font-semibold tracking-wide uppercase opacity-90">Community Rank</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-1">{tier}</h2>
                    <p className="text-sm opacity-90 max-w-sm">
                        {message}
                    </p>
                </div>

                {/* Middle: Savings */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 min-w-[200px] text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <Leaf className="w-4 h-4 text-emerald-300" />
                        <span className="text-xs uppercase tracking-wider opacity-80">CO₂ Saved</span>
                    </div>
                    <span className="text-4xl font-bold block">{savedKg} <span className="text-lg font-normal opacity-80">kg</span></span>
                    <span className="text-xs opacity-70">vs Avg Car Usage</span>
                </div>

                {/* Right: Percentile */}
                <div className="text-center md:text-right">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 border-2 border-white/30 backdrop-blur-md mb-2">
                        <span className="text-xl font-bold">{percentile}%</span>
                    </div>
                    <p className="text-xs opacity-80">Better than {percentile}% of users</p>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-center md:text-left opacity-60 flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>Your ranking is calculated based on estimated CO₂ savings compared to a standard baseline and is anonymous.</span>
            </div>
        </div>
    );
};

export default CommunityImpact;
