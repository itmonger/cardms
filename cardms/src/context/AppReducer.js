export const initialState = {
  user: null,
  theme: 'light',
  currentPage: 'dashboard',
  showModal: false,
  modalType: null,
  editingItem: null,
  searchTerm: '',
  vehicles: [
    { 
      id: 1, 
      vin: '1HGBH41JXMN109186', 
      make: 'Toyota', 
      model: 'Camry', 
      year: 2020, 
      mileage: 25000, 
      color: 'Silver', 
      price: 24999, 
      status: 'Available',
      condition: 'Excellent',
      features: ['Bluetooth', 'Backup Camera', 'Heated Seats'],
      description: 'Well-maintained Toyota Camry with low mileage',
      dateAdded: '2024-01-15'
    },
    { 
      id: 2, 
      vin: '2HGBH41JXMN109187', 
      make: 'Honda', 
      model: 'Civic', 
      year: 2019, 
      mileage: 32000, 
      color: 'Blue', 
      price: 19999, 
      status: 'Financed',
      condition: 'Good',
      features: ['Apple CarPlay', 'Lane Assist'],
      description: 'Reliable Honda Civic with great fuel economy',
      dateAdded: '2024-01-20'
    }
  ],
  customers: [
    { 
      id: 1, 
      name: 'John Smith', 
      email: 'john.smith@email.com', 
      phone: '555-0123', 
      address: '123 Main St, City, State 12345',
      creditScore: 650,
      employment: 'Software Engineer',
      monthlyIncome: 5500,
      dateCreated: '2024-01-10',
      notes: 'Good payment history'
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      email: 'sarah.j@email.com', 
      phone: '555-0234',
      address: '456 Oak Ave, City, State 12346',
      creditScore: 580,
      employment: 'Teacher',
      monthlyIncome: 4200,
      dateCreated: '2024-01-15',
      notes: 'First-time buyer'
    }
  ],
  users: [
    { id: 1, username: 'admin', password: 'admin123', role: 'Admin', name: 'Administrator' },
    { id: 2, username: 'sales1', password: 'sales123', role: 'Sales', name: 'Sales Person' }
  ]
};

export const appReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN': 
      return { ...state, user: action.payload };
    case 'LOGOUT': 
      return { ...state, user: null };
    case 'SET_PAGE': 
      return { ...state, currentPage: action.payload };
    case 'TOGGLE_THEME': 
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'SHOW_MODAL': 
      return { ...state, showModal: true, modalType: action.payload.type, editingItem: action.payload.item || null };
    case 'HIDE_MODAL': 
      return { ...state, showModal: false, modalType: null, editingItem: null };
    case 'SET_SEARCH': 
      return { ...state, searchTerm: action.payload };
    case 'ADD_VEHICLE': 
      return { 
        ...state, 
        vehicles: [...state.vehicles, { ...action.payload, id: Date.now() }],
        showModal: false 
      };
    case 'UPDATE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.map(v => v.id === action.payload.id ? action.payload : v),
        showModal: false
      };
    case 'DELETE_VEHICLE':
      return { ...state, vehicles: state.vehicles.filter(v => v.id !== action.payload) };
    case 'ADD_CUSTOMER':
      return {
        ...state,
        customers: [...state.customers, { ...action.payload, id: Date.now() }],
        showModal: false
      };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(c => c.id === action.payload.id ? action.payload : c),
        showModal: false
      };
    case 'DELETE_CUSTOMER':
      return { ...state, customers: state.customers.filter(c => c.id !== action.payload) };
    default: 
      return state;
  }
};