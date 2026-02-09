import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./router/appRouter.jsx";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
