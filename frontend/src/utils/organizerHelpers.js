/**
 * Organizer Dashboard Helper Utilities
 * Formatting, filtering, sorting, pagination, and status configurations.
 */

/**
 * Format currency amount (ETB / USD format)
 */
export function formatCurrency(amount, currency = "ETB") {
  if (amount === null || amount === undefined || isNaN(amount)) return "0 ETB";
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} ${currency}`;
}

/**
 * Format date string into human readable format
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return "N/A";
  const defaultOpts = {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  };
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", defaultOpts);
  } catch (e) {
    return dateString;
  }
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value, total) {
  if (!total || total === 0) return 0;
  return Math.min(100, Math.round((value / total) * 100));
}

/**
 * Format large numbers (e.g. 1.2k, 15.4k)
 */
export function formatNumber(num) {
  if (!num || isNaN(num)) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
}

/**
 * Get status badge configuration (Monochrome / Black & White)
 */
export function getStatusBadgeConfig(status, eventDate) {
  let normalized = (status || "").toLowerCase();
  if (eventDate) {
    const d = new Date(eventDate);
    if (!isNaN(d.getTime()) && d.getTime() < Date.now()) {
      normalized = "completed";
    }
  }

  switch (normalized) {
    case "published":
    case "active":
    case "confirmed":
    case "paid":
      return {
        label: normalized === "published" ? "Published" : "Confirmed",
        variant: "default",
        bgColor: "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100",
        dotColor: "bg-emerald-400 dark:bg-emerald-500",
      };
    case "upcoming":
      return {
        label: "Upcoming",
        variant: "info",
        bgColor: "bg-zinc-100 text-zinc-900 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700",
        dotColor: "bg-zinc-900 dark:bg-zinc-100",
      };
    case "draft":
    case "pending":
      return {
        label: normalized === "draft" ? "Draft" : "Pending",
        variant: "warning",
        bgColor: "bg-zinc-200 text-zinc-800 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
        dotColor: "bg-zinc-500",
      };
    case "completed":
    case "ended":
    case "checked-in":
    case "checked_in":
      return {
        label: status === "checked_in" || status === "checked-in" ? "Checked In" : "Completed",
        variant: "secondary",
        bgColor: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
        dotColor: "bg-zinc-400",
      };
    case "cancelled":
    case "canceled":
      return {
        label: "Cancelled",
        variant: "destructive",
        bgColor: "bg-zinc-200/60 text-zinc-600 border-zinc-300 dark:bg-zinc-800/60 dark:text-zinc-400 dark:border-zinc-700 line-through",
        dotColor: "bg-zinc-400",
      };
    default:
      return {
        label: status || "Unknown",
        variant: "default",
        bgColor: "bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700",
        dotColor: "bg-zinc-400",
      };
  }
}

/**
 * Filter events by search term, status, and category
 */
export function filterEvents(events = [], search = "", status = "all", category = "all") {
  return events.filter((event) => {
    const matchesSearch =
      !search ||
      event.title?.toLowerCase().includes(search.toLowerCase()) ||
      event.location?.toLowerCase().includes(search.toLowerCase()) ||
      event.category?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "all" ||
      event.status?.toLowerCase() === status.toLowerCase();

    const matchesCategory =
      category === "all" ||
      event.category?.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });
}

/**
 * Sort events array
 */
export function sortEvents(events = [], sortBy = "date", sortOrder = "desc") {
  const sorted = [...events];
  sorted.sort((a, b) => {
    let comparison = 0;
    if (sortBy === "date") {
      comparison = new Date(a.startDate || a.date) - new Date(b.startDate || b.date);
    } else if (sortBy === "title") {
      comparison = (a.title || "").localeCompare(b.title || "");
    } else if (sortBy === "ticketsSold") {
      comparison = (a.ticketsSold || 0) - (b.ticketsSold || 0);
    } else if (sortBy === "revenue") {
      comparison = (a.revenue || 0) - (b.revenue || 0);
    } else if (sortBy === "status") {
      comparison = (a.status || "").localeCompare(b.status || "");
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });
  return sorted;
}

/**
 * Paginate items array
 */
export function paginateItems(items = [], currentPage = 1, pageSize = 6) {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validPage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = (validPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    totalItems,
    totalPages,
    currentPage: validPage,
    pageSize,
    hasNextPage: validPage < totalPages,
    hasPrevPage: validPage > 1,
  };
}
