import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import useAuth from "../hooks/useAuth";
import "./DashboardLayout.css";
import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="layout-dashboard">
      <Navbar />
      <div className="layout-dashboard__container">
        {/* Sidebar */}
        <aside className="layout-dashboard__sidebar">
          <div className="sidebar__user">
            <div className="sidebar__avatar">
              {user?.firstname?.[0]}
              {user?.lastname?.[0]}
            </div>
            <div className="sidebar__user-info">
              <h4>{user?.firstname} {user?.lastname}</h4>
              <span>{user?.role}</span>
            </div>
          </div>

          <nav className="sidebar__nav">
            <Link to={ROUTES.DASHBOARD} className="sidebar__link">
              Dashboard
            </Link>
            {user?.role === "ORGANIZER" && (
              <>
                <Link to={ROUTES.CREATE_EVENT} className="sidebar__link">
                  Create Event
                </Link>
                <Link to={ROUTES.MANAGE_EVENTS} className="sidebar__link">
                  My Events
                </Link>
              </>
            )}
            <button className="sidebar__link sidebar__link--logout" onClick={handleLogout}>
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="layout-dashboard__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
