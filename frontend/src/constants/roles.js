/** User role constants — keep in sync with backend */
export const ROLES = {
  ADMIN: "ADMIN",
  ORGANIZER: "ORGANIZER",
  CUSTOMER: "CUSTOMER",
};

export const ORGANIZER_ROLES = [ROLES.ORGANIZER, ROLES.ADMIN];
export const CUSTOMER_ROLES = [ROLES.CUSTOMER];
export const ADMIN_ROLES = [ROLES.ADMIN];
