import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { ORGANIZER_ROLES, CUSTOMER_ROLES, ADMIN_ROLES } from "../constants/roles";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import HomePage from "../pages/public/HomePage";
import EventsPage from "../pages/EventsPage";
import EventDetails from "../pages/events/EventDetails";
import About from "../pages/about/about";
import Contact from "../pages/contact/contact";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/user/Profile";
import ProfileForm from "../pages/user/ProfileForm";
import RegisteredEvents from "../pages/user/RegisteredEvents";
import Notifications from "../pages/user/Notifications";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardRedirect from "../components/auth/DashboardRedirect";
import GuestRoute from "../components/auth/GuestRoute";
import AdminLayout from "../layouts/AdminLayout";
import Admin_Dashboard from "../pages/admin/Admin_Dashboard";
import UsersPage from "../pages/admin/Users";
import Events from "../pages/admin/Events";
import AdminEventDetails from "../pages/admin/AdminEventDetails";
import Categories from "../pages/admin/Categories";
import AdminRegistrations from "../pages/admin/Registrations";
import Feedback from "../pages/admin/Feedback";
import NotificationsPage from "../pages/admin/Notifications";
import AdminAnalytics from "../pages/admin/Analytics";
import AdminSettings from "../pages/admin/Settings";
import UserDetails from "../components/admin/UserDetails";
import EditUser from "../components/admin/EditUser";

import { OrganizerProvider } from "../context/OrganizerContext";

// Organizer Rebuilt Imports
import OrganizerLayout from "../components/organizer/OrganizerLayout";
import OrganizerDashboard from "../pages/organizer/OrganizerDashboard";
import MyEvents from "../pages/organizer/MyEvents";
import CreateEvent from "../pages/organizer/CreateEvent";
import EditEvent from "../pages/organizer/EditEvent";
import Registrations from "../pages/organizer/Registrations";
import Analytics from "../pages/organizer/Analytics";
import Settings from "../pages/organizer/Settings";

// Customer Rebuilt Imports
import { CustomerProvider } from "../context/CustomerContext";
import CustomerLayout from "../components/customer/CustomerLayout";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import CustomerEvents from "../pages/customer/CustomerEvents";
import CustomerNotifications from "../pages/customer/CustomerNotifications";
import CustomerSettings from "../pages/customer/CustomerSettings";

const ALL_ROLES = [...CUSTOMER_ROLES, ...ORGANIZER_ROLES, ...ADMIN_ROLES];

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.EVENTS} element={<EventsPage />} />
          <Route path={ROUTES.EVENT_DETAIL} element={<EventDetails />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />
        </Route>

        <Route element={<GuestRoute><MainLayout /></GuestRoute>}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        </Route>

        {/* Admin routes — PROTECTED */}
        <Route
          element={
            <ProtectedRoute allowedRoles={ADMIN_ROLES}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<Admin_Dashboard />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/users/:userId" element={<UserDetails />} />
          <Route path="/admin/users/EditUser/:userId" element={<EditUser />} />
          <Route path="/admin/events" element={<Events />} />
          <Route path="/admin/events/:eventId" element={<AdminEventDetails />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/registrations" element={<AdminRegistrations />} />
          <Route path="/admin/feedback" element={<Feedback />} />
          <Route path="/admin/notifications" element={<NotificationsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        {/* Organizer Dashboard Routes — PROTECTED */}
        <Route
          element={
            <ProtectedRoute allowedRoles={ORGANIZER_ROLES}>
              <OrganizerProvider>
                <OrganizerLayout />
              </OrganizerProvider>
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.ORGANIZER_DASHBOARD} element={<OrganizerDashboard />} />
          <Route path={ROUTES.MANAGE_EVENTS} element={<MyEvents />} />
          <Route path={ROUTES.CREATE_EVENT} element={<CreateEvent />} />
          <Route path={ROUTES.EDIT_EVENT_ORGANIZER} element={<EditEvent />} />
          <Route path={ROUTES.ORGANIZER_REGISTRATIONS} element={<Registrations />} />
          <Route path={ROUTES.ORGANIZER_ANALYTICS} element={<Analytics />} />
          <Route path={ROUTES.ORGANIZER_SETTINGS} element={<Settings />} />
        </Route>

        {/* Dashboard Entry Point (Role-Based Redirect) */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={ALL_ROLES}>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* Customer & General User Dashboard Routes — PROTECTED */}
        <Route
          element={
            <ProtectedRoute allowedRoles={CUSTOMER_ROLES}>
              <CustomerProvider>
                <CustomerLayout />
              </CustomerProvider>
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.CUSTOMER_DASHBOARD} element={<CustomerDashboard />} />
          <Route path="/customer/registrations" element={<CustomerEvents />} />
          <Route path={ROUTES.REGISTERED_EVENTS} element={<CustomerEvents />} />
          <Route path="/customer/notifications" element={<CustomerNotifications />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<CustomerNotifications />} />
          <Route path="/customer/profile" element={<CustomerSettings />} />
          <Route path={ROUTES.PROFILE} element={<CustomerSettings />} />
          <Route path={ROUTES.CREATE_PROFILE} element={<ProfileForm />} />
          <Route path={ROUTES.EDIT_PROFILE} element={<ProfileForm />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
