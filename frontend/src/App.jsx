import { AuthProvider } from "./context/AuthContext";
import { GamificationProvider } from "./context/GamificationContext";
import AppRouter from "./router/appRouter.jsx";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <GamificationProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'bg-slate-800 text-white',
            }}
          />
          <AppRouter />
        </GamificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
