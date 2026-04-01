import api from "./axios";

export const environmentService = {
  getAQI: async (lat, lng) => {
    try {
      const response = await api.get('/api/environment/aqi', {
        params: { lat, lng },
      });
      return response.data; // Response contains { aqi: 1-5, ... }
    } catch (error) {
      console.error("Failed to fetch AQI", error);
      throw error;
    }
  }
};
