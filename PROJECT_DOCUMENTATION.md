# STUA Project Documentation

This document outlines the architecture, key process flows, and file responsibilities within the STUA application. It is designed to help developers understand how data moves through the system from frontend interaction to database storage.

## 1. Project Overview

STUA is a web application designed to help users track and compare the environmental impact of their travel choices. It consists of:
- **Frontend**: A React application (Vite) for the user interface.
- **Backend**: A Node.js/Express server handling API requests and business logic.
- **Database**: MongoDB for storing user data, vehicles, trips, and emission factors.

---

## 2. Directory Structure & Key Files

### Frontend (`/frontend/src/`)
- **`pages/`**: Contains the main page components (views).
  - `trips/Trips.jsx`: The main entry for planning a trip (Map, Date, Location search).
  - `trips/TransportComparisonPage.jsx`: Displays the comparison results.
  - `vehicles/VehicleManagementPage.jsx`: Page for managing user vehicles.
  - `analysis/Analysis.jsx`: Data visualization dashboard.
- **`components/`**: Reusable UI components.
  - `TransportComparison.jsx`: The core logic for calculating and displaying emission comparisons.
  - `VehicleManagement.jsx`: Modal/Form for adding and editing vehicles.
  - `NewPlaceSearch.jsx`: Google Places Autocomplete component.
  - `Navbar.jsx`: Application navigation.
- **`services/`**: API handling files.
  - `axios.jsx`: Centralized Axios instance with interceptors for auth tokens and global error handling.
  - `emissionService.js`: Calls calculating emissions.
  - `vehicleService.js`: Calls managing user vehicles.
  - `travelService.js`: Calls logging and retrieving trip history.
  - `analysisService.js`: Calls fetching dashboard stats.

### Backend (`/backend/`)
- **`controllers/`**: Request handlers processing logic.
  - `comparisonController.js`: Logic for transport mode comparisons.
  - `vehicleController.js`: CRUD operations for user vehicles.
  - `travelDataController.js`: Saving and retrieving trip data.
  - `analysisController.js`: Aggregating data for charts/graphs.
  - `authController.js`: User registration and login.
- **`models/`**: Mongoose schemas.
  - `User.js`: User account data.
  - `UserVehicle.js`: User's personal vehicles (model, efficiency, etc.).
  - `Trip.js`: Detailed record of a single trip leg.
  - `travel_data.js`: Simplified record linking users to trips and emissions.
  - `EmissionFactor.js`: Static data for emission calculations (CO2 per km).
- **`services/`**: Business logic separated from controllers.
  - `emissionService.js`: Core calculation logic using emission factors.
  - `travelDataService.js`: Logic for creating linked `Trip` and `TravelData` records.

---

## 3. Key Process Flows

### A. Trip Planning & Logging Flow
This is the core feature where a user compares transport modes and logs a trip.

1.  **User Input**:
    -   **Page**: `Trips.jsx`
    -   **Action**: User enters **Start Location**, **Destination**, and selects a **Date**.
    -   **Logic**: Google Maps API calculates the route distance and duration.
    -   **Hand-off**: On clicking "Analyze Eco-Impact", data (Distance, Duration, Origin, Destination, Date) is passed via `react-router` state to the Comparison Page.

2.  **Comparison & Calculation**:
    -   **Page**: `TransportComparisonPage.jsx` -> `TransportComparison.jsx`
    -   **Action**: The component mounts and immediately requests emission data.
    -   **API Call**: `emissionService.calculateEmission()` is called for standard modes (Bus, Train, Walk) and user's specific vehicles.
    -   **Frontend Logic**:
        -   Modes are sorted by emission (Efficiency).
        -   User vehicles are fetched via `vehicleService.getVehicles()` to include personal options.
        -   "Eco-friendly" tags are applied to low-emission modes (e.g., Walking, Cycling).

3.  **Logging the Trip**:
    -   **Action**: User clicks "I used this mode" on a specific option.
    -   **API Call**: `travelService.addTravelData(tripData)` sends the payload to backend.
    -   **Payload**: Includes `mode`, `distance`, `emissions`, `origin`, `destination`, `date`, and `vehicleId` (if applicable).
    -   **Backend Logic** (`travelDataController.js`):
        -   Receives request.
        -   Calls `travelDataService.createTravelDataService()`.
        -   **Saves Two Records**:
            1.  `Trip`: Detailed geospatial and route info.
            2.  `TravelData`: Link for historical analysis.
    -   **Result**: Database is updated, user is redirected to Dashboard via Toast notification.

### B. Vehicle Management Flow
Allows users to add their own cars/bikes for accurate comparison.

1.  **View Vehicles**:
    -   **Page**: `VehicleManagementPage.jsx`
    -   **API**: `vehicleService.getVehicles()` -> `GET /api/vehicles`.
    -   **Backend**: `vehicleController.getUserVehicles()` queries `UserVehicle` collection by `userId`.

2.  **Add/Edit Vehicle**:
    -   **Component**: `VehicleManagement.jsx` (Modal).
    -   **Input**: User selects Type (Car/Bike), Fuel Type, Engine Size, etc.
    -   **Logic**:
        -   If "Cycle" is selected, emission fields are disabled/hidden (0 emissions).
        -   Otherwise, emission factors are validated.
    -   **API**: `POST /api/vehicles` (Add) or `PUT /api/vehicles/:id` (Update).
    -   **Auth**: Request includes `Authorization: Bearer <token>` automatically via `axios.jsx`.

### C. Analysis & Dashboard Flow
Displays the user's environmental impact over time.

1.  **Data Fetching**:
    -   **Page**: `Analysis.jsx`
    -   **Action**: On load, calls multiple analysis endpoints.
    -   **APIs**:
        -   `getAnalysisSummary`: Total Distance, Total Emissions, Trees Saved.
        -   `getModeBreakdown`: Pie chart transport usage.
        -   `getEmissionTrend`: Line chart of emissions over time.
    -   **Backend Logic** (`analysisController.js`):
        -   Uses MongoDB Aggregation Pipelines (`aggregate()`).
        -   Groups `TravelData` by `mode` or `date`.
        -   Sums up `distance_travelled_km` and `data_travelled_co2`.

### D. Authentication Flow
Secures the application.

1.  **Login/Signup**:
    -   **Pages**: `Login.jsx`, `SignUp.jsx`.
    -   **Action**: User submits credentials.
    -   **API**: `authService.login()` / `register()`.
    -   **Result**: Backend issues a JWT (JSON Web Token).
    -   **Storage**: Frontend stores token in `sessionStorage` (via `axios.jsx`).
    -   **Interceptor**: `axios.jsx` automatically attaches this token to all subsequent API requests.
    -   **Error Handling**: If token expires (401 error), `axios.jsx` intercepts, tries to refresh token, or redirects to `/login`.

---

## 4. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **Auth** | | |
| POST | `/api/auth/register` | Create new user account |
| POST | `/api/auth/login` | Log in and receive token |
| **Vehicles** | | |
| GET | `/api/vehicles` | List user's vehicles |
| POST | `/api/vehicles` | Add a new vehicle |
| PUT | `/api/vehicles/:id` | Update vehicle details |
| DELETE | `/api/vehicles/:id` | Remove a vehicle |
| **Travel** | | |
| POST | `/api/travel/add` | Log a completed trip |
| GET | `/api/travel/history` | Get past trip history |
| **Analysis** | | |
| GET | `/api/analysis/summary` | Get aggregated stats |
| GET | `/api/analysis/mode-breakdown` | Get usage by mode |

