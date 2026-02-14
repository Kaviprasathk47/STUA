import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/axios';

const GamificationContext = createContext();

export const GamificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [grade, setGrade] = useState(0);
    const [level, setLevel] = useState(1);
    const [loading, setLoading] = useState(false);
    const [motivation, setMotivation] = useState("");

    const calculateLevel = (points) => {
        if (points < 100) return 1;
        if (points < 500) return 2;
        if (points < 1000) return 3;
        return 4;
    };

    const fetchGrade = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const userId = user.id || user._id;
            const response = await api.get(`/user-grade/${userId}`);
            const userGrade = response.data.data.grade;
            const motivation = response.data.data.motivation;
            setGrade(userGrade);
            setLevel(calculateLevel(userGrade));
            setMotivation(motivation);
        } catch (error) {
            console.error("Error fetching user grade:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchGrade();
        } else {
            setGrade(0);
            setLevel(1);
            setMotivation("Yupe!.. Let's Begin");
        }
    }, [user]);

    return (
        <GamificationContext.Provider value={{ grade, level, refreshGrade: fetchGrade, loading, motivation }}>
            {children}
        </GamificationContext.Provider>
    );
};

export const useGamification = () => useContext(GamificationContext);
