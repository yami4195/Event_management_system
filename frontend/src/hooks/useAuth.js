import { useState, useEffect } from "react";

/**
 * Hook to get and watch the currently authenticated user from localStorage.
 * Replace body with your AuthContext logic once set up.
 */
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const isAuthenticated = !!user;
  const role = user?.role || null;

  return { user, isAuthenticated, role, isLoading };
};

export default useAuth;
