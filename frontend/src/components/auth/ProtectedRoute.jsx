import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../ui/LoadingSpinner";
import { ROUTES } from "../../constants/routes";
import { ADMIN_ROLES, ORGANIZER_ROLES } from "../../constants/roles";

const getRoleDashboard = (role) => {
  if (ADMIN_ROLES.includes(role)) return "/admin";
  if (ORGANIZER_ROLES.includes(role)) return ROUTES.ORGANIZER_DASHBOARD;
  return ROUTES.CUSTOMER_DASHBOARD;
};

/**
 * Wraps protected routes — redirects to /login if unauthenticated.
 * Optionally accepts `allowedRoles` to restrict by role.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getRoleDashboard(user?.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
export { getRoleDashboard };
