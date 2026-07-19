/** App route path constants — avoids magic strings in router */
export const ROUTES = {
  // Public
  HOME: "/",
  EVENTS: "/events",
  EVENT_DETAIL: "/events/:id",
  EDIT_EVENT: "/events/:id/edit",

  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  // User
  DASHBOARD: "/dashboard",
  CUSTOMER_DASHBOARD: "/dashboard/customer",
  PROFILE: "/profile",
  MY_TICKETS: "/my-tickets",
  REGISTERED_EVENTS: "/dashboard/customer/registrations",
  NOTIFICATIONS: "/dashboard/customer/notifications",

  // Organizer
  ORGANIZER_DASHBOARD: "/dashboard/organizer",
  CREATE_EVENT: "/organizer/events/create",
  MANAGE_EVENTS: "/organizer/events",

  // Admin
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_EVENTS: "/admin/events",
};
