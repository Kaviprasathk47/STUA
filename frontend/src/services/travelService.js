import api from "./axios";

export const addTravelData = async (travelData) => {
    const response = await api.post("/travel/add", travelData);
    return response.data;
};

export const getTravelHistory = async () => {
    const response = await api.get("/travel/history");
    return response.data;
};

export const updateTrip = async (tripId, tripData) => {
    const response = await api.put(`/travel/update/${tripId}`, tripData);
    return response.data;
};

export const deleteTrip = async (tripId) => {
    const response = await api.delete(`/travel/delete/${tripId}`);
    return response.data;
};
