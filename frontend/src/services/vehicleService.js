import api from "./axios";

export const addVehicle = async (vehicleData) => {
    const response = await api.post(`/Vehicle/create`, vehicleData);
    return response.data;
};

export const getVehicles = async () => {
    const response = await api.get(`/Vehicle/get/all`);
    return response.data;
};

export const deleteVehicle = async (id) => {
    const response = await api.delete(`/Vehicle/delete/${id}`);
    return response.data;
};

export const updateVehicle = async (id, vehicleData) => {
    const response = await api.put(`/Vehicle/update/${id}`, vehicleData);
    return response.data;
};
