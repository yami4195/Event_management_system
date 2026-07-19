import { Outlet, Link, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import useAuth from "../hooks/useAuth";
import "./DashboardLayout.css";
import { ROUTES } from "../constants/routes";
import { ORGANIZER_ROLES } from "../constants/roles";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isOrganizer = ORGANIZER_ROLES.includes(user?.role);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="layout-dashboard">
      <Navbar />
      <div className="layout-dashboard__container">
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
            <Link
              to={isOrganizer ? ROUTES.ORGANIZER_DASHBOARD : ROUTES.CUSTOMER_DASHBOARD}
              className={`sidebar__link ${isActive(isOrganizer ? ROUTES.ORGANIZER_DASHBOARD : ROUTES.CUSTOMER_DASHBOARD) ? "sidebar__link--active" : ""}`}
            >
              Dashboard
            </Link>

            {isOrganizer ? (
              <>
                <Link to={ROUTES.MANAGE_EVENTS} className={`sidebar__link ${isActive(ROUTES.MANAGE_EVENTS) ? "sidebar__link--active" : ""}`}>
                  My Events
                </Link>
                <Link to={ROUTES.CREATE_EVENT} className={`sidebar__link ${isActive(ROUTES.CREATE_EVENT) ? "sidebar__link--active" : ""}`}>
                  Create Event
                </Link>
                <Link to={ROUTES.PROFILE} className={`sidebar__link ${isActive(ROUTES.PROFILE) ? "sidebar__link--active" : ""}`}>
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link to={ROUTES.EVENTS} className="sidebar__link">
                  Browse Events
                </Link>
                <Link to={ROUTES.REGISTERED_EVENTS} className={`sidebar__link ${isActive(ROUTES.REGISTERED_EVENTS) ? "sidebar__link--active" : ""}`}>
                  Registered Events
                </Link>
                <Link to={ROUTES.NOTIFICATIONS} className={`sidebar__link ${isActive(ROUTES.NOTIFICATIONS) ? "sidebar__link--active" : ""}`}>
                  Notifications
                </Link>
                <Link to={ROUTES.PROFILE} className={`sidebar__link ${isActive(ROUTES.PROFILE) ? "sidebar__link--active" : ""}`}>
                  Profile
                </Link>
              </>
            )}

            <button className="sidebar__link sidebar__link--logout" onClick={handleLogout}>
              Logout
            </button>
          </nav>
        </aside>

        <main className="layout-dashboard__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
