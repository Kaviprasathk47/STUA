import { useGamification } from '../../context/GamificationContext';
import { Trophy, Star, TrendingUp } from 'lucide-react';

const UserGradeWidget = () => {
    const { grade, level, loading } = useGamification();

    const getLevelTitle = (lvl) => {
        switch (lvl) {
            case 1: return "Eco Beginner";
            case 2: return "Eco Enthusiast";
            case 3: return "Eco Warrior";
            case 4: return "Sustainability Champion";
            default: return "Eco Beginner";
        }
    };

    const getNextLevelThreshold = (lvl) => {
        switch (lvl) {
            case 1: return 100;
            case 2: return 500;
            case 3: return 1000;
            default: return 10000; // Max level
        }
    };

    let nextThreshold = getNextLevelThreshold(level);
    if(grade >nextThreshold){
        nextThreshold *= 10;
    }
    const progress = Math.min((grade / nextThreshold) * 100, 100);

    if (loading) return <div className="animate-pulse h-48 bg-slate-100 rounded-2xl"></div>;

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-wider mb-2 backdrop-blur-sm">
                        LEVEL {level}
                    </span>
                    <h3 className="text-2xl font-bold">{getLevelTitle(level)}</h3>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Trophy className="w-8 h-8 text-yellow-300" />
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between text-sm mb-2 text-indigo-100">
                    <span>Current Progress</span>
                    <span className="font-bold">{grade} / {nextThreshold} pts</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-3 backdrop-blur-sm">
                    <div
                        className="bg-yellow-400 h-3 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1 text-indigo-100 text-xs">
                        <Star className="w-3 h-3" /> next reward
                    </div>
                    <div className="font-bold">New Badge</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1 text-indigo-100 text-xs">
                        <TrendingUp className="w-3 h-3" /> impact
                    </div>
                    <div className="font-bold">Top 10%</div>
                </div>
            </div>
        </div>
    );
};

export default UserGradeWidget;
