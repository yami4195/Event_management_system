/**
 * Organizer Service
 * Simulated backend service providing mock data & API endpoints for organizer dashboard.
 */

// Initial mock dataset
const mockEvents = [
  {
    id: "evt-101",
    title: "Addis Tech Summit 2026",
    category: "Technology & AI",
    startDate: "2026-08-15T09:00:00.000Z",
    endDate: "2026-08-15T18:00:00.000Z",
    location: "Skylight Hotel Convention Center, Addis Ababa",
    isOnline: false,
    price: 1200,
    currency: "ETB",
    capacity: 500,
    ticketsSold: 382,
    revenue: 458400,
    status: "Published",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80",
    description: "The premier technology & AI conference in East Africa gathering top developers, founders, and investors.",
    organizerName: "TechHub Addis",
  },
  {
    id: "evt-102",
    title: "Horn of Africa Startup Expo",
    category: "Business & Finance",
    startDate: "2026-08-28T10:00:00.000Z",
    endDate: "2026-08-29T17:00:00.000Z",
    location: "Millennium Hall, Addis Ababa",
    isOnline: false,
    price: 850,
    currency: "ETB",
    capacity: 1000,
    ticketsSold: 740,
    revenue: 629000,
    status: "Published",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80",
    description: "Showcasing over 100 high-growth startups pitching live to regional venture capitalists.",
    organizerName: "TechHub Addis",
  },
  {
    id: "evt-103",
    title: "Acoustic Jazz & Cultural Night",
    category: "Music & Festivals",
    startDate: "2026-09-05T19:00:00.000Z",
    endDate: "2026-09-05T23:30:00.000Z",
    location: "African Union Grand Ballroom, Addis Ababa",
    isOnline: false,
    price: 500,
    currency: "ETB",
    capacity: 350,
    ticketsSold: 350,
    revenue: 175000,
    status: "Completed",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    description: "An intimate evening of Ethio-Jazz, traditional cuisine, and live ensemble performances.",
    organizerName: "TechHub Addis",
  },
  {
    id: "evt-104",
    title: "Product Design & UX Masterclass",
    category: "Design & UX",
    startDate: "2026-09-12T14:00:00.000Z",
    endDate: "2026-09-12T18:00:00.000Z",
    location: "Online / Google Meet",
    isOnline: true,
    price: 350,
    currency: "ETB",
    capacity: 200,
    ticketsSold: 145,
    revenue: 50750,
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80",
    description: "Hands-on UI/UX design workshop covering Figma component design systems & user research.",
    organizerName: "TechHub Addis",
  },
  {
    id: "evt-105",
    title: "Fintech Innovation Summit 2026",
    category: "Business & Finance",
    startDate: "2026-10-02T09:00:00.000Z",
    endDate: "2026-10-02T17:00:00.000Z",
    location: "Sheraton Addis Luxury Collection, Addis Ababa",
    isOnline: false,
    price: 1500,
    currency: "ETB",
    capacity: 400,
    ticketsSold: 88,
    revenue: 132000,
    status: "Draft",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80",
    description: "Exploring digital banking, mobile payments, and financial inclusion policy across East Africa.",
    organizerName: "TechHub Addis",
  },
  {
    id: "evt-106",
    title: "Addis Marathon & Wellness Festival",
    category: "Sports & Fitness",
    startDate: "2026-10-20T06:00:00.000Z",
    endDate: "2026-10-20T14:00:00.000Z",
    location: "Meskel Square, Addis Ababa",
    isOnline: false,
    price: 250,
    currency: "ETB",
    capacity: 1500,
    ticketsSold: 0,
    revenue: 0,
    status: "Cancelled",
    image: "https://images.unsplash.com/photo-1517649763962-0c623266010b?w=600&auto=format&fit=crop&q=80",
    description: "Annual city marathon with 10k run, healthy food market, and community fitness workshops.",
    organizerName: "TechHub Addis",
  },
];

const mockRegistrations = [
  {
    id: "reg-801",
    attendeeName: "Abebe Bikila",
    email: "abebe.b@example.com",
    phone: "+251 911 234 567",
    eventId: "evt-101",
    eventTitle: "Addis Tech Summit 2026",
    ticketType: "VIP Pass",
    quantity: 2,
    totalPaid: 2400,
    currency: "ETB",
    registrationDate: "2026-07-28T14:32:00.000Z",
    status: "Confirmed",
    checkInStatus: "Not Checked In",
  },
  {
    id: "reg-802",
    attendeeName: "Tigist Haile",
    email: "tigist.h@example.com",
    phone: "+251 912 345 678",
    eventId: "evt-101",
    eventTitle: "Addis Tech Summit 2026",
    ticketType: "General Admission",
    quantity: 1,
    totalPaid: 1200,
    currency: "ETB",
    registrationDate: "2026-07-29T09:15:00.000Z",
    status: "Confirmed",
    checkInStatus: "Checked In",
  },
  {
    id: "reg-803",
    attendeeName: "Dawit Wolde",
    email: "dawit.w@example.com",
    phone: "+251 913 456 789",
    eventId: "evt-102",
    eventTitle: "Horn of Africa Startup Expo",
    ticketType: "Founder Ticket",
    quantity: 1,
    totalPaid: 850,
    currency: "ETB",
    registrationDate: "2026-07-29T11:45:00.000Z",
    status: "Confirmed",
    checkInStatus: "Not Checked In",
  },
  {
    id: "reg-804",
    attendeeName: "Bethlehem Alemu",
    email: "bethlehem.a@example.com",
    phone: "+251 914 567 890",
    eventId: "evt-104",
    eventTitle: "Product Design & UX Masterclass",
    ticketType: "Standard Workshop Pass",
    quantity: 1,
    totalPaid: 350,
    currency: "ETB",
    registrationDate: "2026-07-30T08:20:00.000Z",
    status: "Pending",
    checkInStatus: "Not Checked In",
  },
  {
    id: "reg-805",
    attendeeName: "Solomon Kassa",
    email: "solomon.k@example.com",
    phone: "+251 915 678 901",
    eventId: "evt-103",
    eventTitle: "Acoustic Jazz & Cultural Night",
    ticketType: "Couples Pass",
    quantity: 2,
    totalPaid: 1000,
    currency: "ETB",
    registrationDate: "2026-07-25T16:10:00.000Z",
    status: "Confirmed",
    checkInStatus: "Checked In",
  },
];

const mockNotifications = [
  {
    id: "notif-1",
    title: "New Registration",
    message: "Bethlehem Alemu registered for Product Design & UX Masterclass",
    timestamp: "10 minutes ago",
    read: false,
    type: "registration",
  },
  {
    id: "notif-2",
    title: "Milestone Reached 🎉",
    message: "Addis Tech Summit 2026 reached 75% ticket capacity!",
    timestamp: "2 hours ago",
    read: false,
    type: "milestone",
  },
  {
    id: "notif-3",
    title: "Payout Processed",
    message: "ETB 175,000 revenue for Acoustic Jazz Night transferred to Telebirr Wallet.",
    timestamp: "1 day ago",
    read: true,
    type: "payout",
  },
];

const mockAnalytics = {
  timeRange: "30_days",
  totalRevenue: 1445150,
  revenueTrend: "+18.4%",
  ticketsSold: 1895,
  ticketsTrend: "+24.1%",
  activeEvents: 4,
  completionRate: "94.2%",
  monthlyRevenue: [
    { month: "Jan", revenue: 85000 },
    { month: "Feb", revenue: 120000 },
    { month: "Mar", revenue: 145000 },
    { month: "Apr", revenue: 210000 },
    { month: "May", revenue: 290000 },
    { month: "Jun", revenue: 380000 },
    { month: "Jul", revenue: 445150 },
  ],
  categoryBreakdown: [
    { name: "Business & Finance", count: 740, percentage: 39, revenue: 629000 },
    { name: "Technology & AI", count: 382, percentage: 29, revenue: 458400 },
    { name: "Music & Festivals", count: 350, percentage: 18, revenue: 175000 },
    { name: "Design & UX", count: 145, percentage: 14, revenue: 50750 },
  ],
  topEvents: [
    { name: "Horn of Africa Startup Expo", tickets: 740, revenue: 629000 },
    { name: "Addis Tech Summit 2026", tickets: 382, revenue: 458400 },
    { name: "Acoustic Jazz & Cultural Night", tickets: 350, revenue: 175000 },
    { name: "Product Design & UX Masterclass", tickets: 145, revenue: 50750 },
  ],
};

const mockOrganizerSettings = {
  name: "TechHub Addis",
  email: "organizer@techhubaddis.com",
  phone: "+251 911 000 111",
  bio: "Leading event organizer hosting regional tech summits, startup expos, and creative design workshops in Ethiopia.",
  logoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  payoutMethod: "Telebirr",
  accountNumber: "0911000111",
  emailNotifications: true,
  registrationAlerts: true,
  payoutAlerts: true,
};

// State storage for mutations during session
let eventsStore = [...mockEvents];
let registrationsStore = [...mockRegistrations];
let settingsStore = { ...mockOrganizerSettings };

export const organizerService = {
  // Get dashboard summary stats
  async getDashboardSummary() {
    await new Promise((res) => setTimeout(res, 200));

    const totalEvents = eventsStore.length;
    const upcomingEvents = eventsStore.filter(
      (e) => e.status === "Published" || e.status === "Upcoming"
    ).length;
    const ticketsSold = eventsStore.reduce((sum, e) => sum + (e.ticketsSold || 0), 0);
    const totalRevenue = eventsStore.reduce((sum, e) => sum + (e.revenue || 0), 0);
    const totalRegistrations = registrationsStore.length;

    return {
      success: true,
      data: {
        summary: {
          totalEvents,
          upcomingEvents,
          ticketsSold,
          totalRevenue,
          totalRegistrations,
        },
        recentEvents: eventsStore.slice(0, 5),
        recentRegistrations: registrationsStore.slice(0, 5),
        notifications: mockNotifications,
      },
    };
  },

  // Get all organizer events
  async getEvents() {
    await new Promise((res) => setTimeout(res, 150));
    return {
      success: true,
      data: [...eventsStore],
    };
  },

  // Get single event details
  async getEventById(id) {
    await new Promise((res) => setTimeout(res, 150));
    const event = eventsStore.find((e) => e.id === id);
    if (!event) {
      return { success: false, message: "Event not found" };
    }
    return { success: true, data: { ...event } };
  },

  // Create new event
  async createEvent(eventData) {
    await new Promise((res) => setTimeout(res, 300));
    const newEvent = {
      id: `evt-${Date.now()}`,
      ticketsSold: 0,
      revenue: 0,
      status: eventData.status || "Draft",
      organizerName: settingsStore.name,
      ...eventData,
    };
    eventsStore = [newEvent, ...eventsStore];
    return { success: true, data: newEvent };
  },

  // Update existing event
  async updateEvent(id, eventData) {
    await new Promise((res) => setTimeout(res, 300));
    const index = eventsStore.findIndex((e) => e.id === id);
    if (index === -1) {
      return { success: false, message: "Event not found" };
    }
    eventsStore[index] = { ...eventsStore[index], ...eventData };
    return { success: true, data: eventsStore[index] };
  },

  // Delete event
  async deleteEvent(id) {
    await new Promise((res) => setTimeout(res, 250));
    eventsStore = eventsStore.filter((e) => e.id !== id);
    return { success: true, id };
  },

  // Get registrations
  async getRegistrations() {
    await new Promise((res) => setTimeout(res, 150));
    return {
      success: true,
      data: [...registrationsStore],
    };
  },

  // Toggle check-in status
  async toggleCheckIn(registrationId) {
    await new Promise((res) => setTimeout(res, 200));
    const reg = registrationsStore.find((r) => r.id === registrationId);
    if (reg) {
      reg.checkInStatus = reg.checkInStatus === "Checked In" ? "Not Checked In" : "Checked In";
      return { success: true, data: reg };
    }
    return { success: false, message: "Registration not found" };
  },

  // Get analytics data
  async getAnalytics() {
    await new Promise((res) => setTimeout(res, 200));
    return {
      success: true,
      data: mockAnalytics,
    };
  },

  // Get settings
  async getSettings() {
    await new Promise((res) => setTimeout(res, 150));
    return {
      success: true,
      data: { ...settingsStore },
    };
  },

  // Update settings
  async updateSettings(newSettings) {
    await new Promise((res) => setTimeout(res, 300));
    settingsStore = { ...settingsStore, ...newSettings };
    return { success: true, data: settingsStore };
  },
};
