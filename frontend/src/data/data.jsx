const mock_data = {
  "user": { "name": "Alex" },
  "stats": {
    "totalTrips": 127,
    "totalDistance": 842,
    "co2Saved": 156,
    "score": 8.4
  },
  "transportModes": [
    { "name": "Bicycle", "percentage": 35, "trips": 44, "distance": 294 }
  ],
  "recentTrips": [
    { "date": "2026-02-06", "mode": "Bicycle", "distance": 12.5, "co2": -0.8 }
  ]
}
console.log("Mock data loaded:", mock_data);
 export default mock_data;