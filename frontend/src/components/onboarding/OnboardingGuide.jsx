import React, { useState } from 'react';
import { X, MapPin, BarChart3, Leaf, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

const OnboardingGuide = ({ onComplete, onSkip }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            icon: Sparkles,
            iconColor: 'text-emerald-600',
            iconBg: 'bg-emerald-100',
            title: 'Welcome to STUA!',
            description: 'Your personal Sustainable Transport Usage Analyzer',
            content: [
                'Track your daily trips and commutes',
                'Analyze your transport choices',
                'Calculate your CO₂ emissions',
                'Make informed decisions for a greener future'
            ]
        },
        {
            icon: BarChart3,
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-100',
            title: 'How It Works',
            description: 'Simple, transparent, and data-driven',
            content: [
                'Enter your trip details (origin, destination, date)',
                'Compare emissions across different transport modes',
                'We calculate CO₂ using verified emission datasets',
                'All results are estimates based on distance and mode'
            ]
        },
        {
            icon: MapPin,
            iconColor: 'text-indigo-600',
            iconBg: 'bg-indigo-100',
            title: 'What You Can Do',
            description: 'Take control of your environmental impact',
            content: [
                'Log trips and see real-time emission comparisons',
                'Add your personal vehicles for accurate tracking',
                'View detailed sustainability insights on your dashboard',
                'Track your carbon savings over time'
            ]
        },
        {
            icon: Leaf,
            iconColor: 'text-teal-600',
            iconBg: 'bg-teal-100',
            title: 'Your Benefits',
            description: 'Why sustainable travel matters',
            content: [
                'Understand your personal environmental impact',
                'Make better, greener travel choices',
                'See how you rank among the community',
                'Contribute to a cleaner, healthier planet'
            ]
        }
    ];

    const currentStepData = steps[currentStep];
    const Icon = currentStepData.icon;
    const isLastStep = currentStep === steps.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            onComplete();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 p-6 text-white">
                    <button
                        onClick={onSkip}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Skip onboarding"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 ${currentStepData.iconBg} rounded-2xl flex items-center justify-center`}>
                            <Icon className={`w-8 h-8 ${currentStepData.iconColor}`} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
                            <p className="text-emerald-100 text-sm mt-1">{currentStepData.description}</p>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-6 flex gap-2">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1 flex-1 rounded-full transition-all ${index <= currentStep ? 'bg-white' : 'bg-white/30'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <ul className="space-y-4">
                        {currentStepData.content.map((item, index) => (
                            <li key={index} className="flex items-start gap-3 animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-700 leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Step Counter */}
                    <div className="mt-8 text-center">
                        <span className="text-sm text-slate-500">
                            Step {currentStep + 1} of {steps.length}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 pb-8 flex items-center justify-between gap-4">
                    <button
                        onClick={onSkip}
                        className="text-slate-500 hover:text-slate-700 font-medium transition-colors"
                    >
                        Skip for now
                    </button>

                    <div className="flex gap-3">
                        {currentStep > 0 && (
                            <button
                                onClick={handlePrevious}
                                className="px-6 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                            >
                                Previous
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            {isLastStep ? (
                                <>
                                    Get Started
                                    <Sparkles className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    Next
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingGuide;
