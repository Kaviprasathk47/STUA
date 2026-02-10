import React from 'react';
import { Leaf, Wind, Users, Globe, Target, Footprints, Bike, Train, Info } from 'lucide-react';

const Sustainability = () => {
    return (
        <div className="bg-slate-50 min-h-screen pb-12">
            {/* Hero Section */}
            <div className="relative bg-emerald-700 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>
                <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 font-outfit">
                        Travel Better. Breathe Easier.
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-emerald-100 max-w-3xl mx-auto">
                        Transport contributes significantly to global carbon emissions. Understanding your impact is the first step toward a cleaner, healthier future for our cities and communities.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16 py-12">

                {/* Section 1: Why It Matters */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
                            <Globe className="w-8 h-8 text-emerald-600" />
                            The Bigger Picture
                        </h2>
                        <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                            It's not just about one trip. Collective action creates monumental change.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                <Wind className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">Air Quality</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Reducing vehicle emissions directly lowers pollutants like nitrogen oxides (NOx) and particulate matter, leading to cleaner air in our cities and fewer respiratory issues.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <Leaf className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">Climate Action</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Transport accounts for nearly 25% of global CO₂ emissions. Switching to low-carbon modes is one of the most effective ways individuals can combat climate change.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                                <Users className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">Urban Health</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Less traffic congestion means quieter streets, safer roads for pedestrians, and more space for community living rather than parking and highways.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 2: Actionable Best Practices */}
                <section className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-50 rounded-full opacity-50 blur-3xl"></div>

                    <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                        <Target className="w-8 h-8 text-emerald-600" />
                        Small Changes, Big Impact
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <Footprints className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-slate-800 mb-1">Walk Short Distances</h4>
                                <p className="text-slate-600 text-sm">
                                    For trips under 2km, walking is emission-free and great for health. It often takes the same time as driving when parking is considered.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <Bike className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-slate-800 mb-1">Cycle for Commutes</h4>
                                <p className="text-slate-600 text-sm">
                                    Biking is the most efficient transport for 3-5km trips. It reduces congestion and has zero tailpipe emissions.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <Train className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-slate-800 mb-1">Normalize Public Transit</h4>
                                <p className="text-slate-600 text-sm">
                                    A full bus replaces 50 cars on the road. Trains are even more efficient per passenger mile. Use them for longer journeys.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-slate-800 mb-1">Maintain Your Vehicle</h4>
                                <p className="text-slate-600 text-sm">
                                    If you must drive, keep tires inflated and engine tuned. A well-maintained car uses up to 20% less fuel.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Weekly Challenge (Static/Inspiration) */}
                <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 md:p-12 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1">
                        <div className="inline-block px-3 py-1 bg-emerald-500/30 rounded-full text-xs font-bold tracking-wider mb-4 border border-emerald-400/30">
                            WEEKLY INSPIRATION
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Go Car-Free 3 Times This Week</h2>
                        <p className="text-emerald-100 text-lg mb-6 max-w-xl">
                            Challenge yourself to replace just three short car trips with walking, cycling, or public transport. Notice the difference in your mood and your city.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                                <span className="block text-2xl font-bold">~ 2.4 kg</span>
                                <span className="text-xs text-emerald-100">CO₂ Saved (Avg)</span>
                            </div>
                            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                                <span className="block text-2xl font-bold">~ $5.00</span>
                                <span className="text-xs text-emerald-100">Fuel Saved</span>
                            </div>
                        </div>
                    </div>
                    {/* Abstract illustration placeholder could go here */}
                    <div className="hidden md:flex items-center justify-center w-48 h-48 bg-white/10 rounded-full border-4 border-white/20">
                        <Footprints className="w-24 h-24 text-white/80" />
                    </div>
                </section>

                {/* Section 4: Transparency & Data */}
                <section className="text-center max-w-3xl mx-auto bg-slate-100 rounded-2xl p-8">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Info className="w-6 h-6 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">About Our Data</h3>
                    <p className="text-slate-600 text-sm mb-4">
                        Transparency builds trust. Our emission calculations are based on the latest
                        <strong> DEFRA (Department for Environment, Food & Rural Affairs)</strong> conversion factors.
                        While real-world conditions vary, these standardized values provide a consistent and reliable way to track progress.
                    </p>
                    <p className="text-xs text-slate-400">
                        We believe in empowering you with honest data, not guilt. Every step counts.
                    </p>
                </section>

            </div>
        </div>
    );
};

export default Sustainability;
