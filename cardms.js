
import React, { useState, useEffect, createContext, useContext, useReducer, useCallback } from 'react';

// =============================================================================
// CONTEXT AND STATE MANAGEMENT
// =============================================================================

const AppContext = createContext();

// Comprehensive initial state with all modules
const initialState = {
  user: null,
  theme: 'light',
  loading: false,
  error: null,
  
  // Core Data
  vehicles: [
    {
      id: 1, vin: '1HGBH41JXMN109186', make: 'Toyota', model: 'Camry', year: 2020,
      mileage: 25000, color: 'Silver', condition: 'Excellent', price: 24999, costBasis: 20000,
      status: 'Financed', photos: [
        'https://placehold.co/800x600/007bff/ffffff?text=Toyota+Camry+Front',
        'https://placehold.co/800x600/007bff/ffffff?text=Toyota+Camry+Interior',
        'https://placehold.co/800x600/007bff/ffffff?text=Toyota+Camry+Side'
      ],
      dateAdded: '2024-01-15', description: 'Well-maintained Toyota Camry with low mileage',
      features: ['Bluetooth', 'Backup Camera', 'Heated Seats', 'Cruise Control'],
      kbbValue: 23500, marketPrice: 24200, daysOnLot: 45, viewCount: 127,
      inquiries: 8, testDrives: 3, autoCheckScore: 85, titleIssues: false
    },
    {
      id: 2, vin: '2HGBH41JXMN109187', make: 'Honda', model: 'Civic', year: 2019,
      mileage: 32000, color: 'Blue', condition: 'Good', price: 19999, costBasis: 16500,
      status: 'Available', photos: [
        'https://placehold.co/800x600/28a745/ffffff?text=Honda+Civic+Front',
        'https://placehold.co/800x600/28a745/ffffff?text=Honda+Civic+Interior'
      ],
      dateAdded: '2024-01-20', description: 'Reliable Honda Civic with great fuel economy',
      features: ['Apple CarPlay', 'Lane Assist', 'Honda Sensing', 'Keyless Entry'],
      kbbValue: 19200, marketPrice: 20100, daysOnLot: 28, viewCount: 94,
      inquiries: 12, testDrives: 6, autoCheckScore: 92, titleIssues: false
    },
    {
      id: 3, vin: '3HGBH41JXMN109188', make: 'Ford', model: 'F-150', year: 2021,
      mileage: 18000, color: 'Red', condition: 'Excellent', price: 32999, costBasis: 28000,
      status: 'Financed', photos: [
        'https://placehold.co/800x600/dc3545/ffffff?text=Ford+F150+Front',
        'https://placehold.co/800x600/dc3545/ffffff?text=Ford+F150+Bed'
      ],
      dateAdded: '2024-02-01', description: 'Powerful Ford F-150 pickup truck',
      features: ['4WD', 'Tow Package', 'Sync 3', 'Bed Liner', 'Running Boards'],
      kbbValue: 31800, marketPrice: 33500, daysOnLot: 15, viewCount: 156,
      inquiries: 15, testDrives: 8, autoCheckScore: 88, titleIssues: false
    }
  ],

  customers: [
    {
      id: 1, name: 'John Smith', email: 'john.smith@email.com', phone: '555-0123',
      address: '123 Main St, City, State 12345', creditScore: 650, employment: 'Software Engineer',
      monthlyIncome: 5500, dateCreated: '2024-01-10', notes: 'Good payment history',
      contactPreference: 'email', alternatePhone: '555-0124', ssn: '***-**-1234',
      driverLicense: 'DL123456789', references: ['Jane Doe - 555-0001', 'Bob Johnson - 555-0002'],
      leadSource: 'Website', leadStatus: 'Hot', lastContact: '2024-03-10'
    },
    {
      id: 2, name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '555-0234',
      address: '456 Oak Ave, City, State 12346', creditScore: 580, employment: 'Teacher',
      monthlyIncome: 4200, dateCreated: '2024-01-15', notes: 'First-time buyer',
      contactPreference: 'phone', alternatePhone: '555-0235', ssn: '***-**-2345',
      driverLicense: 'DL234567890', references: ['Mike Wilson - 555-0003'],
      leadSource: 'CarGurus', leadStatus: 'Warm', lastContact: '2024-03-12'
    }
  ],

  loans: [
    {
      id: 1, customerId: 1, vehicleId: 1, loanAmount: 22999, downPayment: 2000,
      interestRate: 12.5, termMonths: 48, monthlyPayment: 608.45,
      startDate: '2024-01-15', status: 'Current', currentBalance: 20156.78,
      nextPaymentDate: '2024-03-15', paymentsMade: 2, paymentsRemaining: 46,
      lastPaymentDate: '2024-02-15', lastPaymentAmount: 608.45,
      totalInterest: 6405.60, insuranceRequired: true, titleStatus: 'Lien Holder',
      automaticPayment: true, lenderPartner: 'AutomaticUSA Network'
    }
  ],

  payments: [
    {
      id: 1, loanId: 1, customerId: 1, amount: 608.45, paymentDate: '2024-01-15',
      paymentMethod: 'Check', confirmationNumber: 'CHK001', status: 'Processed',
      principalAmount: 417.28, interestAmount: 191.17, lateFeeAmount: 0,
      balanceAfter: 21582.33, processedBy: 'Jane Doe', notes: 'First payment'
    }
  ],

  collections: [
    {
      id: 1, loanId: 3, customerId: 2, status: 'Active', priority: 'High',
      daysPastDue: 35, amountPastDue: 629.47, totalOwed: 754.97,
      lastContactDate: '2024-03-10', lastContactMethod: 'Phone',
      nextContactDate: '2024-03-17', contactAttempts: 3,
      escalationLevel: 2, assignedTo: 'Collections Team',
      notes: 'Customer promised payment by 3/20. Follow up needed.'
    }
  ],

  integrations: {
    carGurus: {
      connected: false,
      apiKey: null,
      listings: [],
      lastSync: null,
      dealerRating: 4.2,
      totalReviews: 127
    },
    autoCheck: {
      connected: false,
      apiKey: null,
      reportsUsed: 0,
      monthlyLimit: 100
    },
    kelleyBlueBook: {
      connected: false,
      apiKey: null,
      valuationsUsed: 0,
      monthlyLimit: 200
    },
    automaticUSA: {
      connected: false,
      apiKey: null,
      lenderNetwork: [],
      approvalRate: 0
    }
  },

  website: {
    domain: 'https://yourdealership.com',
    template: 'modern',
    isPublished: false,
    lastUpdated: null,
    seoSettings: {
      title: 'Quality Used Cars - Your Dealership',
      description: 'Find quality used cars with financing available',
      keywords: 'used cars, financing, auto loans'
    },
    contactInfo: {
      name: 'Premier Auto Sales',
      phone: '555-CARS-123',
      email: 'sales@yourdealership.com',
      address: '123 Auto Row, Your City, ST 12345',
      hours: 'Mon-Sat: 9AM-7PM, Sun: 12PM-5PM'
    }
  },

  leads: [
    {
      id: 1, source: 'Website', customerName: 'Mike Wilson', phone: '555-0456',
      email: 'mike.w@email.com', interestedVehicle: 2, message: 'Interested in financing options',
      status: 'New', assignedTo: null, dateReceived: '2024-03-15', priority: 'Medium'
    }
  ],

  users: [
    {
      id: 1, username: 'admin', password: 'admin123', role: 'Admin',
      name: 'System Administrator', email: 'admin@dealership.com', permissions: ['all']
    },
    {
      id: 2, username: 'sales1', password: 'sales123', role: 'Sales Staff',
      name: 'Jane Doe', email: 'jane@dealership.com', permissions: ['vehicles', 'customers', 'leads']
    },
    {
      id: 3, username: 'finance1', password: 'finance123', role: 'Finance Manager',
      name: 'John Finance', email: 'john.f@dealership.com', permissions: ['financing', 'payments', 'reports']
    }
  ],

  financingRates: [
    { creditRange: '720+', rate: 8.9, term: 36, description: 'Excellent Credit' },
    { creditRange: '720+', rate: 9.5, term: 48, description: 'Excellent Credit' },
    { creditRange: '650-719', rate: 12.5, term: 48, description: 'Good Credit' },
    { creditRange: '580-649', rate: 15.9, term: 48, description: 'Fair Credit' },
    { creditRange: '500-579', rate: 19.9, term: 48, description: 'Poor Credit' }
  ]
};

// Enhanced reducer with all operations
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    
    // Vehicle operations
    case 'ADD_VEHICLE':
      return { ...state, vehicles: [...state.vehicles, { ...action.payload, id: Date.now() }] };
    case 'UPDATE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.map(v => v.id === action.payload.id ? action.payload : v)
      };
    case 'DELETE_VEHICLE':
      return { ...state, vehicles: state.vehicles.filter(v => v.id !== action.payload) };

    // Customer operations
    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, { ...action.payload, id: Date.now() }] };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(c => c.id === action.payload.id ? action.payload : c)
      };

    // Loan operations
    case 'ADD_LOAN':
      return { ...state, loans: [...state.loans, { ...action.payload, id: Date.now() }] };
    case 'UPDATE_LOAN':
      return {
        ...state,
        loans: state.loans.map(l => l.id === action.payload.id ? action.payload : l)
      };

    // Payment operations
    case 'ADD_PAYMENT':
      return { ...state, payments: [...state.payments, { ...action.payload, id: Date.now() }] };

    // Lead operations
    case 'ADD_LEAD':
      return { ...state, leads: [...state.leads, { ...action.payload, id: Date.now() }] };
    case 'UPDATE_LEAD':
      return {
        ...state,
        leads: state.leads.map(l => l.id === action.payload.id ? action.payload : l)
      };

    // Integration operations
    case 'UPDATE_INTEGRATION':
      return {
        ...state,
        integrations: {
          ...state.integrations,
          [action.payload.service]: {
            ...state.integrations[action.payload.service],
            ...action.payload.data
          }
        }
      };

    // Website operations
    case 'UPDATE_WEBSITE':
      return {
        ...state,
        website: { ...state.website, ...action.payload }
      };

    default:
      return state;
  }
};

// =============================================================================
// UTILITY FUNCTIONS AND CALCULATIONS
// =============================================================================

// Financial calculations
const calculateMonthlyPayment = (loanAmount, annualRate, termMonths) => {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return loanAmount / termMonths;
  const payment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                  (Math.pow(1 + monthlyRate, termMonths) - 1);
  return Math.round(payment * 100) / 100;
};

const calculateTotalInterest = (monthlyPayment, termMonths, loanAmount) => {
  return Math.round((monthlyPayment * termMonths - loanAmount) * 100) / 100;
};

// Formatting utilities
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US');
};

const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

// =============================================================================
// EXTERNAL API INTEGRATION SERVICES
// =============================================================================

const IntegrationService = {
  // CarGurus Integration
  carGurus: {
    async authenticate(apiKey) {
      // Simulate API authentication
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, dealerId: 'CG' + Math.random().toString(36).substr(2, 9) });
        }, 1000);
      });
    },

    async syncListings(vehicles) {
      // Simulate listing synchronization
      return new Promise((resolve) => {
        setTimeout(() => {
          const listings = vehicles.filter(v => v.status === 'Available').map(v => ({
            vehicleId: v.id,
            listingId: 'CG' + v.id + Math.random().toString(36).substr(2, 5),
            status: 'Active',
            views: Math.floor(Math.random() * 200) + 50,
            leads: Math.floor(Math.random() * 10) + 1
          }));
          resolve(listings);
        }, 1500);
      });
    },

    async getMarketAnalysis(vehicle) {
      // Simulate market analysis
      return new Promise((resolve) => {
        setTimeout(() => {
          const basePrice = vehicle.price;
          resolve({
            averageMarketPrice: basePrice * (0.95 + Math.random() * 0.1),
            priceRange: {
              low: basePrice * 0.9,
              high: basePrice * 1.1
            },
            daysOnMarket: Math.floor(Math.random() * 60) + 10,
            competitorCount: Math.floor(Math.random() * 20) + 5,
            priceRecommendation: basePrice * (0.98 + Math.random() * 0.04)
          });
        }, 800);
      });
    }
  },

  // AutoCheck Integration
  autoCheck: {
    async getVehicleHistory(vin) {
      // Simulate vehicle history report
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            vin,
            score: Math.floor(Math.random() * 40) + 60, // 60-100 score
            reportId: 'AC' + vin.substr(-6),
            history: {
              accidents: Math.floor(Math.random() * 3),
              owners: Math.floor(Math.random() * 4) + 1,
              serviceRecords: Math.floor(Math.random() * 10) + 5,
              titleIssues: Math.random() > 0.8,
              floodDamage: Math.random() > 0.95,
              lemonHistory: Math.random() > 0.98
            },
            lastUpdated: new Date().toISOString()
          });
        }, 1200);
      });
    },

    async validateVIN(vin) {
      // Simulate VIN validation and decoding
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            valid: vin.length === 17,
            make: ['Toyota', 'Honda', 'Ford', 'Chevrolet'][Math.floor(Math.random() * 4)],
            model: ['Sedan', 'SUV', 'Truck', 'Coupe'][Math.floor(Math.random() * 4)],
            year: 2015 + Math.floor(Math.random() * 9),
            engine: ['2.4L 4-Cyl', '3.5L V6', '5.0L V8'][Math.floor(Math.random() * 3)],
            transmission: ['Automatic', 'Manual'][Math.floor(Math.random() * 2)]
          });
        }, 500);
      });
    }
  },

  // Kelly Blue Book Integration
  kelleyBlueBook: {
    async getVehicleValue(vehicle) {
      // Simulate KBB valuation
      return new Promise((resolve) => {
        setTimeout(() => {
          const baseValue = vehicle.price * (0.85 + Math.random() * 0.3);
          resolve({
            vehicleId: vehicle.id,
            tradeInValue: {
              excellent: baseValue * 1.1,
              good: baseValue,
              fair: baseValue * 0.9,
              poor: baseValue * 0.75
            },
            retailValue: baseValue * 1.25,
            privatePartyValue: baseValue * 1.15,
            lastUpdated: new Date().toISOString(),
            confidence: Math.floor(Math.random() * 30) + 70 // 70-100%
          });
        }, 900);
      });
    },

    async getDepreciation(vehicle) {
      // Simulate depreciation analysis
      return new Promise((resolve) => {
        setTimeout(() => {
          const currentYear = new Date().getFullYear();
          const vehicleAge = currentYear - vehicle.year;
          resolve({
            currentValue: vehicle.price,
            originalMSRP: vehicle.price * (1.2 + vehicleAge * 0.1),
            depreciationRate: 12 + Math.random() * 8, // 12-20% per year
            projectedValue: {
              oneYear: vehicle.price * 0.88,
              twoYears: vehicle.price * 0.76,
              threeYears: vehicle.price * 0.65
            }
          });
        }, 700);
      });
    }
  },

  // AutomaticUSA Integration
  automaticUSA: {
    async connectLenders() {
      // Simulate lender network connection
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            lenders: [
              { id: 1, name: 'Premier Auto Finance', rates: '8.9% - 24.9%', terms: '24-84 months' },
              { id: 2, name: 'Quick Approval Lending', rates: '12.5% - 29.9%', terms: '24-72 months' },
              { id: 3, name: 'Credit Union Partners', rates: '6.9% - 18.9%', terms: '36-72 months' },
              { id: 4, name: 'Subprime Specialists', rates: '15.9% - 35.9%', terms: '24-60 months' }
            ],
            connected: true,
            lastSync: new Date().toISOString()
          });
        }, 1100);
      });
    },

    async submitApplication(customer, vehicle, loanDetails) {
      // Simulate loan application submission
      return new Promise((resolve) => {
        setTimeout(() => {
          const approvalChance = customer.creditScore / 10; // Higher credit = better chance
          const approved = Math.random() * 100 < approvalChance;
          
          resolve({
            applicationId: 'AU' + Date.now(),
            status: approved ? 'Approved' : 'Declined',
            approvedAmount: approved ? loanDetails.loanAmount : 0,
            approvedRate: approved ? loanDetails.interestRate * (0.8 + Math.random() * 0.4) : 0,
            approvedTerm: approved ? loanDetails.termMonths : 0,
            lenderName: approved ? 'AutomaticUSA Partner' : null,
            conditions: approved ? ['Proof of income required', 'Insurance verification'] : ['Insufficient credit history']
          });
        }, 2000);
      });
    }
  }
};

// =============================================================================
// MAIN APPLICATION COMPONENT
// =============================================================================

const App = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Auto-save to localStorage
  useEffect(() => {
    const saveData = {
      vehicles: state.vehicles,
      customers: state.customers,
      loans: state.loans,
      payments: state.payments,
      leads: state.leads,
      integrations: state.integrations,
      website: state.website
    };
    localStorage.setItem('dealershipData', JSON.stringify(saveData));
  }, [state]);

  // Load data from localStorage on startup
  useEffect(() => {
    const savedData = localStorage.getItem('dealershipData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        Object.keys(parsed).forEach(key => {
          if (parsed[key] && Array.isArray(parsed[key]) || typeof parsed[key] === 'object') {
            // Merge saved data with initial state
            dispatch({ type: `SET_${key.toUpperCase()}`, payload: parsed[key] });
          }
        });
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, IntegrationService }}>
      <div className={`app ${state.theme}`}>
        <GlobalStyles theme={state.theme} />
        {state.user ? <DashboardLayout /> : <LoginPage />}
      </div>
    </AppContext.Provider>
  );
};

// =============================================================================
// GLOBAL STYLES COMPONENT
// =============================================================================

const GlobalStyles = ({ theme }) => (
  <style jsx global>{`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
      line-height: 1.6;
      color: ${theme === 'light' ? '#1f2937' : '#f9fafb'};
      background: ${theme === 'light' ? '#f8fafc' : '#0f172a'};
    }

    .app {
      min-height: 100vh;
      transition: all 0.3s ease;
    }

    /* Navigation Styles */
    .navbar {
      background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
      padding: 1rem 2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .nav-tabs {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .nav-tab {
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      transition: all 0.3s;
      font-weight: 500;
      border: 2px solid transparent;
    }

    .nav-tab:hover,
    .nav-tab.active {
      background-color: rgba(255,255,255,0.15);
      border-color: rgba(255,255,255,0.3);
      transform: translateY(-2px);
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: white;
    }

    /* Button Styles */
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      justify-content: center;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
    }

    .btn-success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    .btn-danger {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }

    .btn-warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
    }

    .btn-info {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: white;
    }

    .btn-secondary {
      background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
      color: white;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    }

    .btn:active {
      transform: translateY(0);
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
    }

    .btn-lg {
      padding: 1rem 2rem;
      font-size: 1.1rem;
    }

    /* Layout Styles */
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: ${theme === 'light' ? '#1f2937' : '#f9fafb'};
      margin: 0;
    }

    /* Card Styles */
    .card {
      background: ${theme === 'light' ? 'white' : '#1e293b'};
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 10px 25px rgba(0,0,0,${theme === 'light' ? '0.1' : '0.3'});
      margin-bottom: 1.5rem;
      border: 1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'};
      transition: all 0.3s;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 35px rgba(0,0,0,${theme === 'light' ? '0.15' : '0.4'});
    }

    .card-header {
      border-bottom: 1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'};
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
      color:
