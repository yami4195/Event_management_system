import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import OrganizerSidebar from "./OrganizerSidebar";
import OrganizerNavbar from "./OrganizerNavbar";
import { useOrganizer } from "../../hooks/useOrganizer";
import "@/styles/components/organizer.css";

export default function OrganizerLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { notifications } = useOrganizer();
  const location = useLocation();

  // Page title mapper
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard/organizer") return "Organizer Dashboard";
    if (path === "/organizer/events") return "My Events";
    if (path === "/organizer/events/create") return "Create New Event";
    if (path.includes("/edit")) return "Edit Event";
    if (path === "/organizer/registrations") return "Attendee Registrations";
    if (path === "/organizer/analytics") return "Event Analytics";
    if (path === "/organizer/settings") return "Organizer Settings";
    return "Organizer Portal";
  };

  return (
    <div className="organizer-layout-shell">
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <OrganizerSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
      />

      {/* Main Wrapper */}
      <div
        className={`organizer-main-wrapper ${
          isCollapsed ? "organizer-main-wrapper--expanded" : ""
        }`}
      >
        {/* Top Navbar */}
        <OrganizerNavbar
          onToggleSidebar={() => setIsMobileOpen(!isMobileOpen)}
          notifications={notifications}
          title={getPageTitle()}
        />

        {/* Content Container */}
        <main className="organizer-content-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
