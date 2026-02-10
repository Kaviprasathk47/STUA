const axios = require('axios');

async function testModes() {
    const modes = ['walking', 'cycling', 'train', 'bus', 'car'];
    const distanceKm = 10;

    // Mock vehicle ID - we might need a real one for car to work, 
    // but the user says ONLY car is showing. This implies others are failing.
    // So let's test others first without vehicle ID.

    for (const mode of modes) {
        try {
            console.log(`Testing mode: ${mode}`);
            const payload = {
                mode: mode,
                distance: distanceKm,
                vehicleDetails: undefined // No vehicle for non-car
            };

            // Backend URL - assuming localhost:5000 based on previous context
            const response = await axios.post('http://localhost:5000/api/emissions/calculate', payload);
            console.log(`✅ ${mode}: Success`, response.data);
        } catch (error) {
            console.log(`❌ ${mode}: Failed`, error.response ? error.response.data : error.message);
        }
    }
}

testModes();
