// Vehicle Constants
export const VEHICLE_MAKES = [
  'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler',
  'Dodge', 'Ford', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jeep',
  'Kia', 'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'Mitsubishi',
  'Nissan', 'Ram', 'Subaru', 'Toyota', 'Volkswagen', 'Volvo'
];

export const VEHICLE_CONDITIONS = [
  'Excellent',
  'Good', 
  'Fair',
  'Poor'
];

export const VEHICLE_STATUSES = [
  'Available',
  'Financed',
  'Sold',
  'Reserved',
  'Maintenance'
];

export const COMMON_FEATURES = [
  'Air Conditioning',
  'Apple CarPlay',
  'Android Auto',
  'Backup Camera',
  'Blind Spot Monitoring',
  'Bluetooth',
  'Cruise Control',
  'GPS Navigation',
  'Heated Seats',
  'Keyless Entry',
  'Lane Assist',
  'Leather Seats',
  'Moonroof',
  'Power Windows',
  'Remote Start',
  'Sunroof',
  'Third Row Seating',
  'Tow Package'
];

// Credit Score Ranges
export const CREDIT_SCORE_RANGES = {
  EXCELLENT: { min: 800, max: 850, label: 'Excellent', color: '#059669' },
  VERY_GOOD: { min: 740, max: 799, label: 'Very Good', color: '#10b981' },
  GOOD: { min: 670, max: 739, label: 'Good', color: '#3b82f6' },
  FAIR: { min: 580, max: 669, label: 'Fair', color: '#f59e0b' },
  POOR: { min: 300, max: 579, label: 'Poor', color: '#ef4444' }
};

// Financing Constants
export const LOAN_TERMS = [12, 24, 36, 48, 60, 72, 84]; // months
export const INTEREST_RATES = {
  EXCELLENT: { min: 3.5, max: 5.0 },
  VERY_GOOD: { min: 5.0, max: 7.0 },
  GOOD: { min: 7.0, max: 10.0 },
  FAIR: { min: 10.0, max: 15.0 },
  POOR: { min: 15.0, max: 20.0 }
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager', 
  SALES: 'Sales',
  FINANCE: 'Finance'
};

// Application Constants
export const APP_CONFIG = {
  NAME: 'CarDeal Pro',
  VERSION: '1.0.0',
  COMPANY: 'Your Dealership Name',
  DEFAULT_CURRENCY: 'USD',
  DATE_FORMAT: 'MM/DD/YYYY',
  PHONE_FORMAT: '(XXX) XXX-XXXX'
};

// Navigation Menu Items
export const NAVIGATION_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'vehicles', label: 'Vehicles', icon: '🚗' },
  { key: 'customers', label: 'Customers', icon: '👥' },
  { key: 'financing', label: 'Financing', icon: '💰' },
  { key: 'payments', label: 'Payments', icon: '💳' },
  { key: 'integrations', label: 'Integrations', icon: '🔗' },
  { key: 'reports', label: 'Reports', icon: '📈' }
];

// Theme Colors
export const THEME_COLORS = {
  primary: '#3b82f6',
  secondary: '#6b7280',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
  light: '#f8fafc',
  dark: '#1f2937'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'cardeal_user',
  THEME: 'cardeal_theme',
  VEHICLES: 'cardeal_vehicles',
  CUSTOMERS: 'cardeal_customers'
};