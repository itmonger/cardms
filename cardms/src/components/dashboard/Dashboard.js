import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { styles } from '../../styles/styles';

const Dashboard = () => {
  const { state, dispatch } = useApp();
  
  const availableVehicles = state.vehicles.filter(v => v.status === 'Available').length;
  const financedVehicles = state.vehicles.filter(v => v.status === 'Financed').length;
  const totalInventoryValue = state.vehicles.reduce((sum, v) => sum + v.price, 0);
  
  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h2>Dashboard</h2>
        <div>
          <button 
            style={{...styles.button, ...styles.buttonPrimary, marginRight: '1rem'}}
            onClick={() => dispatch({ type: 'SHOW_MODAL', payload: { type: 'addVehicle' } })}
          >
            + Add Vehicle
          </button>
          <button 
            style={{...styles.button, ...styles.buttonSuccess}}
            onClick={() => dispatch({ type: 'SHOW_MODAL', payload: { type: 'addCustomer' } })}
          >
            + Add Customer
          </button>
        </div>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {state.vehicles.length}
          </div>
          <div style={{ opacity: '0.9' }}>Total Vehicles</div>
        </div>
        <div style={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
          color: 'white', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {state.customers.length}
          </div>
          <div style={{ opacity: '0.9' }}>Total Customers</div>
        </div>
        <div style={{ 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
          color: 'white', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {availableVehicles}
          </div>
          <div style={{ opacity: '0.9' }}>Available</div>
        </div>
        <div style={{ 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', 
          color: 'white', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {formatCurrency(totalInventoryValue)}
          </div>
          <div style={{ opacity: '0.9' }}>Total Inventory Value</div>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={{ marginBottom: '1rem' }}>Recent Activity</h3>
        <div>
          <p>• Vehicle added: {state.vehicles[state.vehicles.length - 1]?.make} {state.vehicles[state.vehicles.length - 1]?.model}</p>
          <p>• Customer added: {state.customers[state.customers.length - 1]?.name}</p>
          <p>• System status: All integrations active</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;