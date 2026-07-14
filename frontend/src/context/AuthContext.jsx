import { createContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/auth.service";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ── Determine storage engine based on "remember me" ── */
  const getStorage = () => {
    return localStorage.getItem("rememberMe") === "true"
      ? localStorage
      : sessionStorage;
  };

  /* ── Restore session on mount ── */
  useEffect(() => {
    const init = async () => {
      const storage = getStorage();
      const token = storage.getItem("token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Verify token is still valid by calling /auth/me
        const res = await authService.getProfile();
        const userData = res.data?.data?.user ?? res.data?.user ?? null;
        setUser(userData);
      } catch {
        // Token is invalid or expired — clear storage
        storage.removeItem("token");
        storage.removeItem("user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  /* ── Login ── */
  const login = useCallback(async (email, password, rememberMe = false) => {
    const res = await authService.login({ email, password });
    const { user: userData, token } = res.data?.data ?? res.data ?? {};

    if (!token || !userData) {
      throw new Error("Invalid server response");
    }

    // Set remember me preference
    localStorage.setItem("rememberMe", rememberMe ? "true" : "false");

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", token);
    storage.setItem("user", JSON.stringify(userData));

    // Also keep token in localStorage for axios interceptor
    localStorage.setItem("token", token);

    setUser(userData);
    return userData;
  }, []);

  /* ── Register ── */
  const register = useCallback(async (data) => {
    const res = await authService.register(data);
    const { user: userData, token } = res.data?.data ?? res.data ?? {};

    if (!token || !userData) {
      throw new Error("Invalid server response");
    }

    localStorage.setItem("rememberMe", "true");
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    return userData;
  }, []);

  /* ── Logout ── */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore errors — we clear locally regardless
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
