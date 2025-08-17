import React, { useReducer } from 'react';
import { AppContext } from './context/AppContext';
import { appReducer, initialState } from './context/AppReducer';
import LoginPage from './components/common/LoginPage';
import Navigation from './components/common/Navigation';
import Modal from './components/common/Modal';
import Dashboard from './components/dashboard/Dashboard';
import VehicleManagement from './components/vehicles/VehicleManagement';
import VehicleForm from './components/vehicles/VehicleForm';
import CustomerManagement from './components/customers/CustomerManagement';
import CustomerForm from './components/customers/CustomerForm';
import FinancingModule from './components/financing/FinancingModule';

const App = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const renderPage = () => {
    switch (state.currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'vehicles': return <VehicleManagement />;
      case 'customers': return <CustomerManagement />;
      case 'financing': return <FinancingModule />;
      case 'payments': return <div><h2>Payment Management</h2><p>Coming soon...</p></div>;
      case 'integrations': return <div><h2>Integrations</h2><p>Coming soon...</p></div>;
      case 'reports': return <div><h2>Reports</h2><p>Coming soon...</p></div>;
      default: return <Dashboard />;
    }
  };

  const renderModal = () => {
    if (!state.showModal) return null;

    const handleClose = () => dispatch({ type: 'HIDE_MODAL' });

    switch (state.modalType) {
      case 'addVehicle':
        return (
          <Modal onClose={handleClose}>
            <VehicleForm 
              onSave={(data) => dispatch({ type: 'ADD_VEHICLE', payload: data })}
              onCancel={handleClose}
            />
          </Modal>
        );
      case 'editVehicle':
        return (
          <Modal onClose={handleClose}>
            <VehicleForm 
              vehicle={state.editingItem}
              onSave={(data) => dispatch({ type: 'UPDATE_VEHICLE', payload: data })}
              onCancel={handleClose}
            />
          </Modal>
        );
      case 'addCustomer':
        return (
          <Modal onClose={handleClose}>
            <CustomerForm 
              onSave={(data) => dispatch({ type: 'ADD_CUSTOMER', payload: data })}
              onCancel={handleClose}
            />
          </Modal>
        );
      case 'editCustomer':
        return (
          <Modal onClose={handleClose}>
            <CustomerForm 
              customer={state.editingItem}
              onSave={(data) => dispatch({ type: 'UPDATE_CUSTOMER', payload: data })}
              onCancel={handleClose}
            />
          </Modal>
        );
      default:
        return null;
    }
  };

  if (!state.user) {
    return (
      <AppContext.Provider value={{ state, dispatch }}>
        <LoginPage />
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Navigation />
        <div style={{ padding: '2rem' }}>
          {renderPage()}
        </div>
        {renderModal()}
      </div>
    </AppContext.Provider>
  );
};

export default App;