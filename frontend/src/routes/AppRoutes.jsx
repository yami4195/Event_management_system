import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../pages/public/HomePage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import EventList from "../pages/events/EventList";
import CreateEvent from "../pages/events/CreateEvent";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User / Organizer */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/create" element={<CreateEvent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
