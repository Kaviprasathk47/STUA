import api from "./axios";

export const addTravelData = async (travelData) => {
    const response = await api.post("/travel/add", travelData);
    return response.data;
};

export const getTravelHistory = async () => {
    const response = await api.get("/travel/history");
    return response.data;
};
