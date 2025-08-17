import React from 'react';
import { useApp } from '../../context/AppContext';
import { styles } from '../../styles/styles';

const Navigation = () => {
  const { state, dispatch } = useApp();
  
  const navStyle = { 
    background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)', 
    padding: '1rem 2rem', 
    color: 'white' 
  };
  
  const buttonStyle = { 
    background: 'none', 
    border: 'none', 
    color: 'white', 
    padding: '0.5rem 1rem', 
    cursor: 'pointer', 
    borderRadius: '4px', 
    marginRight: '0.5rem' 
  };
  
  const pages = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'vehicles', label: 'Vehicles' },
    { key: 'customers', label: 'Customers' },
    { key: 'financing', label: 'Financing' },
    { key: 'payments', label: 'Payments' },
    { key: 'integrations', label: 'Integrations' },
    { key: 'reports', label: 'Reports' }
  ];
  
  return (
    <nav style={navStyle}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ margin: 0 }}>🚗 CarDeal Pro</h1>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {pages.map(page => (
            <button 
              key={page.key}
              style={{
                ...buttonStyle, 
                background: state.currentPage === page.key ? 'rgba(255,255,255,0.2)' : 'none'
              }} 
              onClick={() => dispatch({ type: 'SET_PAGE', payload: page.key })}
            >
              {page.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Welcome, {state.user?.name}</span>
          <button 
            style={buttonStyle} 
            onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          >
            {state.theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button 
            style={buttonStyle} 
            onClick={() => dispatch({ type: 'LOGOUT' })}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;