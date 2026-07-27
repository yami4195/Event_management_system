export const initialCategories = [
  {
    id: "cat_1",
    name: "Technology",
    description: "AI, Programming, Software, Cloud Computing & Cybersecurity",
    icon: "Cpu",
    color: "indigo",
    colorHex: "#6366f1",
    eventsCount: 42,
    createdDate: "Jul 15, 2026",
    status: "Active",
  },
  {
    id: "cat_2",
    name: "Business & Finance",
    description: "Startups, Investment, FinTech, Entrepreneurship & Marketing",
    icon: "Briefcase",
    color: "emerald",
    colorHex: "#10b981",
    eventsCount: 30,
    createdDate: "May 10, 2026",
    status: "Active",
  },
  {
    id: "cat_3",
    name: "Design & UX",
    description: "Product Design, Web UX/UI, Graphic Arts, Design Systems",
    icon: "Palette",
    color: "purple",
    colorHex: "#a855f7",
    eventsCount: 24,
    createdDate: "Jun 02, 2026",
    status: "Active",
  },
  {
    id: "cat_4",
    name: "Music & Entertainment",
    description: "Live Concerts, Festivals, DJ Sets & Music Production",
    icon: "Music",
    color: "rose",
    colorHex: "#f43f5e",
    eventsCount: 18,
    createdDate: "Jan 20, 2026",
    status: "Active",
  },
  {
    id: "cat_5",
    name: "Health & Wellness",
    description: "Fitness, Mental Health, Medical Research & Yoga Retreats",
    icon: "Heart",
    color: "amber",
    colorHex: "#f59e0b",
    eventsCount: 15,
    createdDate: "Jul 01, 2026",
    status: "Active",
  },
  {
    id: "cat_6",
    name: "Education & Science",
    description: "Academic Research, Online Courses, Lectures & STEM Education",
    icon: "BookOpen",
    color: "blue",
    colorHex: "#3b82f6",
    eventsCount: 22,
    createdDate: "Feb 14, 2026",
    status: "Active",
  },
  {
    id: "cat_7",
    name: "Gaming & Esports",
    description: "Tournaments, Game Dev, VR/AR Expo & Community Gatherings",
    icon: "Gamepad2",
    color: "indigo",
    colorHex: "#6366f1",
    eventsCount: 19,
    createdDate: "Mar 29, 2026",
    status: "Active",
  },
  {
    id: "cat_8",
    name: "Food & Culinary Arts",
    description: "Wine Tasting, Cooking Classes, Food Trucks & Restaurant Expos",
    icon: "Utensils",
    color: "amber",
    colorHex: "#f59e0b",
    eventsCount: 12,
    createdDate: "Apr 05, 2026",
    status: "Active",
  },
  {
    id: "cat_9",
    name: "Photography & Media",
    description: "Film Screenings, Photo Walks, Videography & Journalism",
    icon: "Camera",
    color: "purple",
    colorHex: "#a855f7",
    eventsCount: 14,
    createdDate: "May 18, 2026",
    status: "Active",
  },
  {
    id: "cat_10",
    name: "Sports & Athletics",
    description: "Marathons, League Matches, Outdoor Adventure & Cycling",
    icon: "Trophy",
    color: "emerald",
    colorHex: "#10b981",
    eventsCount: 16,
    createdDate: "Jun 11, 2026",
    status: "Active",
  },
  {
    id: "cat_11",
    name: "Fashion & Lifestyle",
    description: "Runway Shows, Sustainable Fashion, Beauty & Apparel Expo",
    icon: "Sparkles",
    color: "rose",
    colorHex: "#f43f5e",
    eventsCount: 10,
    createdDate: "Jan 08, 2026",
    status: "Active",
  },
  {
    id: "cat_12",
    name: "Crypto & Blockchain",
    description: "Web3, NFTs, Smart Contracts, Mining & DeFi Seminars",
    icon: "Coins",
    color: "blue",
    colorHex: "#3b82f6",
    eventsCount: 8,
    createdDate: "Feb 22, 2026",
    status: "Active",
  },
  {
    id: "cat_13",
    name: "AI & Machine Learning",
    description: "LLMs, Neural Networks, Computer Vision & Robotics",
    icon: "Bot",
    color: "indigo",
    colorHex: "#6366f1",
    eventsCount: 11,
    createdDate: "Mar 15, 2026",
    status: "Active",
  },
  {
    id: "cat_14",
    name: "Real Estate & Architecture",
    description: "Property Expos, Interior Design & Urban Planning Conferences",
    icon: "Building",
    color: "emerald",
    colorHex: "#10b981",
    eventsCount: 6,
    createdDate: "Apr 19, 2026",
    status: "Active",
  },
  {
    id: "cat_15",
    name: "Environmental Science",
    description: "Sustainability, Green Energy, Climate Action & Recycling",
    icon: "Leaf",
    color: "emerald",
    colorHex: "#10b981",
    eventsCount: 4,
    createdDate: "May 30, 2026",
    status: "Active",
  },
  {
    id: "cat_16",
    name: "Legacy Web Development",
    description: "Archived HTML/CSS Meetups & PHP 5 Legacy Forums",
    icon: "Code",
    color: "slate",
    colorHex: "#64748b",
    eventsCount: 2,
    createdDate: "Nov 12, 2024",
    status: "Disabled",
  },
  {
    id: "cat_17",
    name: "Flash Animation & Games",
    description: "Deprecated Flash 8 Vector Animations & ActionScript 2",
    icon: "FolderX",
    color: "slate",
    colorHex: "#64748b",
    eventsCount: 0,
    createdDate: "Oct 04, 2023",
    status: "Disabled",
  },
  {
    id: "cat_18",
    name: "Print Media & Publishing",
    description: "Traditional Newspaper Workshops & Offset Printing Forums",
    icon: "Newspaper",
    color: "slate",
    colorHex: "#64748b",
    eventsCount: 0,
    createdDate: "Dec 01, 2023",
    status: "Disabled",
  },
];

export let categories = [...initialCategories];

export const getCategoryById = (id) => categories.find((cat) => cat.id === id);

export const createCategory = (data) => {
  const newCat = {
    id: `cat_${Date.now()}`,
    name: data.name,
    description: data.description || "",
    icon: data.icon || "Tag",
    color: data.color || "indigo",
    colorHex: data.colorHex || "#6366f1",
    eventsCount: 0,
    createdDate: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    status: data.status || "Active",
  };
  categories = [newCat, ...categories];
  return newCat;
};

export const updateCategory = (id, updatedFields) => {
  categories = categories.map((cat) =>
    cat.id === id ? { ...cat, ...updatedFields } : cat
  );
  return getCategoryById(id);
};

export const deleteCategory = (id) => {
  categories = categories.filter((cat) => cat.id !== id);
};

export const bulkUpdateStatus = (ids, status) => {
  categories = categories.map((cat) =>
    ids.includes(cat.id) ? { ...cat, status } : cat
  );
};

export const bulkDeleteCategories = (ids) => {
  categories = categories.filter((cat) => !ids.includes(cat.id));
};
