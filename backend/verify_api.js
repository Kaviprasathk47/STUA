import axios from 'axios';

const testEndpoint = async () => {
    try {
        console.log("Testing POST http://localhost:5000/api/emissions/calculate...");

        // Mock payload for a car (since strict mode requires valid data)
        // We need a valid vehicle ID if we pass vehicleDetails, but here we can try with just mode 'bus' which is simpler
        const payload = {
            mode: 'bus',
            distance: 10
        };

        const response = await axios.post('http://localhost:5000/api/emissions/calculate', payload);

        console.log("Status:", response.status);
        console.log("Data:", response.data);

        if (response.status === 200 || response.status === 201) {
            console.log("✅ API Endpoint is reachable and working!");
        } else {
            console.log("❌ API returned unexpected status.");
        }

    } catch (error) {
        if (error.response) {
            console.error("❌ Error Status:", error.response.status);
            console.error("❌ Error Data:", error.response.data);
        } else {
            console.error("❌ Connection Error:", error.message);
        }
    }
};

testEndpoint();
