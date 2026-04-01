import logger from "../utils/logger.js";

import axios from "axios";

export const getAQI = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required." });
    }

    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "Server configuration error: OPENWEATHERMAP_API_KEY is missing." });
    }

    const response = await axios.get(`https://api.openweathermap.org/data/2.5/air_pollution`, {
      params: { lat, lon: lng, appid: apiKey }
    });
    
    const data = response.data;
    
    // Extract AQI
    if (data && data.list && data.list.length > 0) {
      const aqi = data.list[0].main.aqi;
      return res.status(200).json({ aqi, fullData: data });
    } else {
      return res.status(404).json({ message: "AQI data not found for this location." });
    }
  } catch (error) {
    logger.error(`Error fetching AQI: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch AQI data." });
  }
};
