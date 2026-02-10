import api from "./axios";

export const calculateEmission = async (data) => {
    const response = await api.post("/api/emissions/calculate", data);
    return response.data;
};
