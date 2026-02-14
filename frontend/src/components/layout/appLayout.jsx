import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import OnboardingGuide from "../onboarding/OnboardingGuide";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/axios";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user, refreshUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user needs onboarding (only after user data is loaded)
    if (!loading && user && user.isOnboarded === false) {
      setShowOnboarding(true);
    }
  }, [user, loading]);

  const handleCompleteOnboarding = async () => {
    try {
      await api.post("/auth/complete-onboarding");
      await refreshUser(); // Refresh user data to update isOnboarded flag
      setShowOnboarding(false);
      const role = user?.role || "user";
      navigate(`/${role}/dashboard`);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      setShowOnboarding(false);
    }
  };

  const handleSkipOnboarding = async () => {
    try {
      await api.post("/auth/complete-onboarding");
      await refreshUser();
      setShowOnboarding(false);
    } catch (error) {
      console.error("Failed to skip onboarding:", error);
      setShowOnboarding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      <div className="flex pt-16">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main
          className={`flex-1 transition-all ${sidebarOpen ? "ml-64" : "ml-16"
            }`}
        >
          <Outlet />
        </main>
      </div>

      {/* Onboarding Guide Modal */}
      {showOnboarding && (
        <OnboardingGuide
          onComplete={handleCompleteOnboarding}
          onSkip={handleSkipOnboarding}
        />
      )}
    </div>
  );
};

export default AppLayout;
