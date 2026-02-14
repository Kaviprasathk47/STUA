import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout.jsx";
import ProtectedRoute from "./protectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";

import Dashboard from "../pages/dashBoard/Dashboard.jsx";
import Trips from "../pages/trips/Trips.jsx";
import TransportComparisonPage from "../pages/trips/TransportComparisonPage.jsx";
import VehicleManagementPage from "../pages/vehicles/VehicleManagementPage.jsx";
import Login from "../pages/login/login.jsx";
import SignUp from "../pages/signUp/SignUp.jsx";
import AnalysisPage from "../pages/Analysis/Analysis.jsx";
import Sustainability from "../pages/sustainability/Sustainability.jsx";
import Leaderboard from "../pages/Leaderboard/Leaderboard.jsx";
import Settings from "../pages/Settings/Settings.jsx";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes: login, signup. Redirect to /dashboard if already logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<SignUp />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected routes: require auth, redirect to /login if not */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/transport-comparison" element={<TransportComparisonPage />} />
            <Route path="/vehicles" element={<VehicleManagementPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
        {/* <Route element={<ProtectedRoute role={["admin"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/trips" element={<Trips />} />
            <Route path="/admin/transport-comparison" element={<TransportComparisonPage />} />
            <Route path="/admin/vehicles" element={<VehicleManagementPage />} />
            <Route path="/admin/analysis" element={<AnalysisPage />} />
            <Route path="/admin/sustainability" element={<Sustainability />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
        </Route> */}

        {/* Catch-all: send unknown paths to home or login (handled by auth state) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
