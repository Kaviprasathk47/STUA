import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../services/axios";

const TOKEN_KEY = "accessToken";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const clearToken = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const setToken = useCallback((token) => {
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token);
      setIsAuthenticated(true);
      // We could trigger a fetchUser here if we wanted to be sure
    } else {
      clearToken();
    }
  }, [clearToken]);

  /** Call after successful login: store token and mark authenticated */
  const login = useCallback((token) => {
    setLoading(true);
    setToken(token);
    // Trigger immediate fetch of user details after login
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.error("Failed to fetch user after login", err);
        // If fetch fails, we might want to logout or keep trying?
        // For now, assume token is valid but fetch failed? 
        // Better to not set user if failed.
      })
      .finally(() => {
        setLoading(false);
      });
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
      .then((res) => {
        setIsAuthenticated(true);
        setUser(res.data.user);
      })
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, [clearToken]);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to refresh user", err);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        setToken,
        refreshUser,
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
