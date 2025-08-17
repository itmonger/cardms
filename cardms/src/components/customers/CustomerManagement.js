import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { styles } from '../../styles/styles';

const CustomerManagement = () => {
  const { state, dispatch } = useApp();
  
  const filteredCustomers = state.customers.filter(customer =>
    customer.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    customer.phone.includes(state.searchTerm) ||
    customer.employment.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  const handleEdit = (customer) => {
    dispatch({ type: 'SHOW_MODAL', payload: { type: 'editCustomer', item: customer } });
  };

  const handleDelete = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      dispatch({ type: 'DELETE_CUSTOMER', payload: customerId });
    }
  };

  const getCreditRating = (score) => {
    if (score >= 800) return { text: 'Excellent', color: '#059669', bg: '#dcfce7' };
    if (score >= 740) return { text: 'Very Good', color: '#10b981', bg: '#d1fae5' };
    if (score >= 670) return { text: 'Good', color: '#3b82f6', bg: '#dbeafe' };
    if (score >= 580) return { text: 'Fair', color: '#f59e0b', bg: '#fef3c7' };
    return { text: 'Poor', color: '#ef4444', bg: '#fee2e2' };
  };

  const avgCreditScore = state.customers.length > 0 ? 
    Math.round(state.customers.reduce((sum, c) => sum + c.creditScore, 0) / state.customers.length) : 0;
  
  const totalMonthlyIncome = state.customers.reduce((sum, c) => sum + (c.monthlyIncome || 0), 0);

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
        <div>
          <h2 style={{ margin: 0 }}>Customer Management</h2>
          <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
            Manage your customer database ({filteredCustomers.length} customers)
          </p>
        </div>
        <button 
          style={{...styles.button, ...styles.buttonSuccess}}
          onClick={() => dispatch({ type: 'SHOW_MODAL', payload: { type: 'addCustomer' } })}
        >
          + Add Customer
        </button>
      </div>
      
      {/* Search Bar */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <input
            type="text"
            placeholder="Search customers by name, email, phone, or employment..."
            value={state.searchTerm}
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            style={{...styles.input, marginTop: '0'}}
          />
        </div>
        <button 
          style={{...styles.button, ...styles.buttonSecondary}}
          onClick={() => dispatch({ type: 'SET_SEARCH', payload: '' })}
        >
          Clear Search
        </button>
      </div>

      {/* Customer Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '1.5rem' 
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{state.customers.length}</div>
          <div style={{ fontSize: '0.8rem', opacity: '0.9' }}>Total Customers</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{avgCreditScore}</div>
          <div style={{ fontSize: '0.8rem', opacity: '0.9' }}>Avg Credit Score</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            {formatCurrency(totalMonthlyIncome)}
          </div>
          <div style={{ fontSize: '0.8rem', opacity: '0.9' }}>Total Monthly Income</div>
        </div>
      </div>

      {/* Customer Cards */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredCustomers.map(customer => {
          const creditRating = getCreditRating(customer.creditScore);
          return (
            <div key={customer.id} style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>{customer.name}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
                    <div><strong>Email:</strong> {customer.email}</div>
                    <div><strong>Phone:</strong> {customer.phone}</div>
                    <div><strong>Employment:</strong> {customer.employment || 'Not specified'}</div>
                    <div><strong>Monthly Income:</strong> {customer.monthlyIncome ? formatCurrency(customer.monthlyIncome) : 'Not specified'}</div>
                    <div><strong>Date Added:</strong> {formatDate(customer.dateCreated)}</div>
                    <div>
                      <strong>Credit Score:</strong> 
                      <span style={{
                        marginLeft: '0.5rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        background: creditRating.bg,
                        color: creditRating.color
                      }}>
                        {customer.creditScore} ({creditRating.text})
                      </span>
                    </div>
                  </div>
                  {customer.address && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
                      <strong>Address:</strong> {customer.address}
                    </div>
                  )}
                  {customer.notes && (
                    <div style={{ 
                      marginTop: '0.75rem', 
                      padding: '0.75rem', 
                      background: '#f9fafb', 
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      color: '#374151'
                    }}>
                      <strong>Notes:</strong> {customer.notes}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button 
                    onClick={() => handleEdit(customer)}
                    style={{...styles.button, ...styles.buttonPrimary, padding: '0.5rem 0.75rem', fontSize: '0.8rem'}}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(customer.id)}
                    style={{...styles.button, ...styles.buttonDanger, padding: '0.5rem 0.75rem', fontSize: '0.8rem'}}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredCustomers.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            color: '#6b7280',
            background: 'white',
            borderRadius: '12px'
          }}>
            {state.searchTerm ? 
              `No customers found matching "${state.searchTerm}".` : 
              'No customers yet. Add your first customer!'
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;