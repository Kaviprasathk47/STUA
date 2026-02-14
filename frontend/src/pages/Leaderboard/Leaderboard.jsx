import React, { useEffect, useState } from 'react';
import api from '../../services/axios';
import { Trophy, Medal, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await api.get('/user-grade/leaderboard');
                setLeaders(response.data.data);
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
                setError("Failed to load leaderboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <Crown className="w-6 h-6 text-yellow-500" />;
            case 1: return <Medal className="w-6 h-6 text-slate-400" />;
            case 2: return <Medal className="w-6 h-6 text-amber-700" />;
            default: return <span className="text-slate-500 font-bold w-6 text-center">{index + 1}</span>;
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading leaderboard...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex items-center justify-center gap-3 mb-8">
                <Trophy className="w-10 h-10 text-yellow-500" />
                <h1 className="text-3xl font-bold text-slate-800">Sustainability Leaders</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto ">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Rank</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Green Score</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Motivation</th>

                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {leaders.map((leader, index) => (
                                <tr
                                    key={leader._id}
                                    className={`hover:bg-slate-50 transition-colors ${user && (user._id || user.id) === leader.userId._id ? 'bg-indigo-50/50' : ''}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {getRankIcon(index)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                                                {leader.userId?.name?.charAt(0) || 'U'}
                                            </div>
                                            <span className={`font-medium ${user && (user._id || user.id) === leader.userId._id ? 'text-indigo-700' : 'text-slate-800'}`}>
                                                {leader.userId?.name || 'Unknown User'}
                                                {user && (user._id || user.id) === leader.userId._id && " (You)"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            {leader.grade} pts
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            {leader.motivation}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {leaders.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        No leaders yet. Be the first to log a green trip!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
