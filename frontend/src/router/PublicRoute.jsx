import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Public routes (login, signup). If already authenticated, redirect to dashboard.
 */
const PublicRoute = () => {
  const { isAuthenticated, loading} = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-green-500 border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    // Default to user role if role is undefined

    return <Navigate to={`/dashboard`} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
