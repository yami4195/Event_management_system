import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getRoleDashboard } from "./ProtectedRoute";

const DashboardRedirect = () => {
  const { user } = useAuth();
  return <Navigate to={getRoleDashboard(user?.role)} replace />;
};

export default DashboardRedirect;
