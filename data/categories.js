/* export const defaultCategories = [
  // Income Categories
  {
    id: "salary",
    name: "Salary",
    type: "INCOME",
    color: "#059669", // emerald-600
    icon: "Wallet",
  },
  {
    id: "freelance",
    name: "Freelance",
    type: "INCOME",
    color: "#0ea5e9", // sky-500
    icon: "Laptop",
  },
  {
    id: "investments",
    name: "Investments",
    type: "INCOME",
    color: "#7c3aed", // violet-600
    icon: "TrendingUp",
  },
  {
    id: "business",
    name: "Business",
    type: "INCOME",
    color: "#db2777", // pink-600
    icon: "Building",
  },
  {
    id: "rental",
    name: "Rental",
    type: "INCOME",
    color: "#fbbf24", // amber-400
    icon: "Home",
  },
  {
    id: "other-income",
    name: "Other Income",
    type: "INCOME",
    color: "#334155", // slate-700
    icon: "Plus",
  },

  // Expense Categories
  {
    id: "housing",
    name: "Housing",
    type: "EXPENSE",
    color: "#dc2626", // red-600
    icon: "Home",
    subcategories: ["Rent", "Mortgage", "Property Tax", "Maintenance"],
  },
  {
    id: "transportation",
    name: "Transportation",
    type: "EXPENSE",
    color: "#ea580c", // orange-600
    icon: "Car",
    subcategories: ["Fuel", "Public Transport", "Maintenance", "Parking"],
  },
  {
    id: "groceries",
    name: "Groceries",
    type: "EXPENSE",
    color: "#65a30d", // lime-600
    icon: "Shopping",
  },
  {
    id: "utilities",
    name: "Utilities",
    type: "EXPENSE",
    color: "#0891b2", // cyan-600
    icon: "Zap",
    subcategories: ["Electricity", "Water", "Gas", "Internet", "Phone"],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    type: "EXPENSE",
    color: "#9333ea", // purple-600
    icon: "Film",
    subcategories: ["Movies", "Games", "Streaming Services"],
  },
  {
    id: "food",
    name: "Food",
    type: "EXPENSE",
    color: "#e11d48", // rose-600
    icon: "UtensilsCrossed",
  },
  {
    id: "shopping",
    name: "Shopping",
    type: "EXPENSE",
    color: "#f43f5e", // rose-500
    icon: "ShoppingBag",
    subcategories: ["Clothing", "Electronics", "Home Goods"],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    type: "EXPENSE",
    color: "#0d9488", // teal-600
    icon: "HeartPulse",
    subcategories: ["Medical", "Dental", "Pharmacy", "Insurance"],
  },
  {
    id: "education",
    name: "Education",
    type: "EXPENSE",
    color: "#4f46e5", // indigo-600
    icon: "GraduationCap",
    subcategories: ["Tuition", "Books", "Courses"],
  },
  {
    id: "personal",
    name: "Personal Care",
    type: "EXPENSE",
    color: "#c026d3", // fuchsia-600
    icon: "Smile",
    subcategories: ["Haircut", "Gym", "Beauty"],
  },
  {
    id: "travel",
    name: "Travel",
    type: "EXPENSE",
    color: "#0284c7", // blue-600
    icon: "Plane",
  },
  {
    id: "insurance",
    name: "Insurance",
    type: "EXPENSE",
    color: "#475569", // slate-600
    icon: "Shield",
    subcategories: ["Life", "Home", "Vehicle"],
  },
  {
    id: "gifts",
    name: "Gifts & Donations",
    type: "EXPENSE",
    color: "#e879f9", // pink-400
    icon: "Gift",
  },
  {
    id: "bills",
    name: "Bills & Fees",
    type: "EXPENSE",
    color: "#fb7185", // rose-400
    icon: "Receipt",
    subcategories: ["Bank Fees", "Late Fees", "Service Charges"],
  },
  {
    id: "other-expense",
    name: "Other Expenses",
    type: "EXPENSE",
    color: "#64748b", // slate-500
    icon: "MoreHorizontal",
  },
];

export const categoryColors = defaultCategories.reduce((acc, category) => {
  acc[category.id] = category.color;
  return acc;
}, {});
*/

export const defaultCategories = [
  // Income Categories
  {
    id: "salary",
    name: "Salary",
    type: "INCOME",
    color: "#059669",
    icon: "Wallet",
  },
  {
    id: "freelance",
    name: "Freelance",
    type: "INCOME",
    color: "#0ea5e9",
    icon: "Laptop",
  },
  {
    id: "bonus",
    name: "Bonus",
    type: "INCOME",
    color: "#16a34a",
    icon: "Gift",
  },
  {
    id: "investment-return",
    name: "Investment Return",
    type: "INCOME",
    color: "#7c3aed",
    icon: "TrendingUp",
  },
  {
    id: "rental-income",
    name: "Rental Income",
    type: "INCOME",
    color: "#fbbf24",
    icon: "Home",
  },
  {
    id: "gift",
    name: "Gift",
    type: "INCOME",
    color: "#e879f9",
    icon: "Gift",
  },

  // Expense Categories
  {
    id: "entertainment",
    name: "Entertainment",
    type: "EXPENSE",
    color: "#9333ea",
    icon: "Film",
  },
  {
    id: "health",
    name: "Health",
    type: "EXPENSE",
    color: "#ef4444",
    icon: "HeartPulse",
  },
  {
    id: "electronics",
    name: "Electronics",
    type: "EXPENSE",
    color: "#0284c7",
    icon: "Monitor",
  },
  {
    id: "travel",
    name: "Travel",
    type: "EXPENSE",
    color: "#0ea5e9",
    icon: "Plane",
  },
  {
    id: "education",
    name: "Education",
    type: "EXPENSE",
    color: "#4f46e5",
    icon: "GraduationCap",
  },
  {
    id: "utilities",
    name: "Utilities",
    type: "EXPENSE",
    color: "#0891b2",
    icon: "Zap",
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
    type: "EXPENSE",
    color: "#f97316",
    icon: "CreditCard",
  },
  {
    id: "groceries",
    name: "Groceries",
    type: "EXPENSE",
    color: "#65a30d",
    icon: "ShoppingCart",
  },
  {
    id: "dining",
    name: "Dining",
    type: "EXPENSE",
    color: "#dc2626",
    icon: "UtensilsCrossed",
  },
  {
    id: "rent",
    name: "Rent",
    type: "EXPENSE",
    color: "#64748b",
    icon: "Home",
  },
];

export const categoryColors = defaultCategories.reduce((acc, category) => {
  acc[category.id] = category.color;
  return acc;
}, {});

