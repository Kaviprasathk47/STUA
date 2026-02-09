import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../services/axios";

const TOKEN_KEY = "accessToken";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const clearToken = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
  }, []);

  const setToken = useCallback((token) => {
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token);
      setIsAuthenticated(true);
    } else {
      clearToken();
    }
  }, [clearToken]);

  /** Call after successful login: store token and mark authenticated */
  const login = useCallback((token) => {
    setToken(token);
  }, [setToken]);

  const logout = useCallback(() => {
    clearToken();
  }, [clearToken]);

  // On app load: if we have a stored token, validate it with /auth/me
  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then(() => setIsAuthenticated(true))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, [clearToken]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        logout,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
