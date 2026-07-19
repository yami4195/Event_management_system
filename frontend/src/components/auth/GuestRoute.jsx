import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../ui/LoadingSpinner";
import { getRoleDashboard } from "./ProtectedRoute";

/**
 * Wraps guest-only routes (login, register).
 * Redirects to role dashboard if already authenticated.
 */
const GuestRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getRoleDashboard(user?.role)} replace />;
  }

  return children;
};

export default GuestRoute;
