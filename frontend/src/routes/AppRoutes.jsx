import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { ORGANIZER_ROLES, CUSTOMER_ROLES } from "../constants/roles";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import HomePage from "../pages/public/HomePage";
import EventList from "../pages/events/EventList";
import EventDetails from "../pages/events/EventDetails";
import About from "../pages/about/about";
import Contact from "../pages/contact/contact";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import Dashboard from "../pages/dashboard/Dashboard";
import CreateEvent from "../pages/events/CreateEvent";
import EditEvent from "../pages/events/EditEvent";
import MyEvents from "../pages/events/MyEvents";
import Profile from "../pages/user/Profile";
import ProfileForm from "../pages/user/ProfileForm";
import RegisteredEvents from "../pages/user/RegisteredEvents";
import Notifications from "../pages/user/Notifications";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardRedirect from "../components/auth/DashboardRedirect";
import GuestRoute from "../components/auth/GuestRoute";

const ALL_ROLES = [...CUSTOMER_ROLES, ...ORGANIZER_ROLES];

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.EVENTS} element={<EventList />} />
          <Route path={ROUTES.EVENT_DETAIL} element={<EventDetails />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />
        </Route>

        <Route element={<GuestRoute><MainLayout /></GuestRoute>}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={ALL_ROLES}><DashboardLayout /></ProtectedRoute>}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardRedirect />} />
          <Route
            path={ROUTES.CUSTOMER_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={CUSTOMER_ROLES}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ORGANIZER_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={ORGANIZER_ROLES}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
          <Route path={ROUTES.CREATE_PROFILE} element={<ProfileForm />} />
          <Route path={ROUTES.EDIT_PROFILE} element={<ProfileForm />} />
          <Route
            path={ROUTES.REGISTERED_EVENTS}
            element={
              <ProtectedRoute allowedRoles={CUSTOMER_ROLES}>
                <RegisteredEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.NOTIFICATIONS}
            element={
              <ProtectedRoute allowedRoles={CUSTOMER_ROLES}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.CREATE_EVENT}
            element={
              <ProtectedRoute allowedRoles={ORGANIZER_ROLES}>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.EDIT_EVENT}
            element={
              <ProtectedRoute allowedRoles={ORGANIZER_ROLES}>
                <EditEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MANAGE_EVENTS}
            element={
              <ProtectedRoute allowedRoles={ORGANIZER_ROLES}>
                <MyEvents />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
