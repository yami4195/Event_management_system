import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import CustomerSidebar from "./CustomerSidebar";
import CustomerNavbar from "./CustomerNavbar";
import { useCustomer } from "../../hooks/useCustomer";
import "../../styles/components/customer-layout.css";

export default function CustomerLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { notifications } = useCustomer();
  const location = useLocation();

  // Page title mapper matching organizer pattern
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard/customer") return "Customer Dashboard";
    if (path === "/events") return "Browse All Events";
    if (path === "/customer/registrations") return "My Registered Event Passes";
    if (path === "/customer/notifications") return "Account Notifications";
    if (path === "/customer/profile") return "Customer Profile Settings";
    return "Customer Portal";
  };

  return (
    <div className="customer-layout-shell">
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 35,
          }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <CustomerSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
      />

      {/* Main Content Wrapper */}
      <div
        className={`customer-main-wrapper ${
          isCollapsed ? "customer-main-wrapper--expanded" : ""
        }`}
      >
        {/* Top Navbar Header */}
        <CustomerNavbar
          onToggleSidebar={() => setIsMobileOpen(!isMobileOpen)}
          notifications={notifications}
          title={getPageTitle()}
        />

        {/* Dynamic Route Content Area */}
        <main className="customer-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
