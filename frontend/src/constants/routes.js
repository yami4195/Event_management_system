/** App route path constants — avoids magic strings in router */
export const ROUTES = {
  // Public
  HOME: "/",
  EVENTS: "/events",
  EVENT_DETAIL: "/events/:id",

  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  // User
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  MY_TICKETS: "/my-tickets",

  // Organizer
  ORGANIZER_DASHBOARD: "/organizer/dashboard",
  CREATE_EVENT: "/organizer/events/create",
  MANAGE_EVENTS: "/organizer/events",

  // Admin
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_EVENTS: "/admin/events",
};
