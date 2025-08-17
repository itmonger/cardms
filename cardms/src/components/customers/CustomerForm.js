import React, { useState } from 'react';
import { styles } from '../../styles/styles';

const CustomerForm = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    creditScore: customer?.creditScore || 600,
    employment: customer?.employment || '',
    monthlyIncome: customer?.monthlyIncome || 0,
    notes: customer?.notes || ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (formData.creditScore < 300 || formData.creditScore > 850) {
      newErrors.creditScore = 'Credit score must be between 300 and 850';
    }
    if (formData.monthlyIncome < 0) {
      newErrors.monthlyIncome = 'Monthly income cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const customerData = {
      ...formData,
      creditScore: parseInt(formData.creditScore),
      monthlyIncome: parseFloat(formData.monthlyIncome),
      dateCreated: customer?.dateCreated || new Date().toISOString().split('T')[0],
      id: customer?.id
    };
    onSave(customerData);
  };

  const inputStyle = (fieldName) => ({
    ...styles.input,
    borderColor: errors[fieldName] ? '#ef4444' : '#d1d5db'
  });

  const getCreditRating = (score) => {
    if (score >= 800) return { text: 'Excellent', color: '#059669' };
    if (score >= 740) return { text: 'Very Good', color: '#10b981' };
    if (score >= 670) return { text: 'Good', color: '#3b82f6' };
    if (score >= 580) return { text: 'Fair', color: '#f59e0b' };
    return { text: 'Poor', color: '#ef4444' };
  };

  const creditRating = getCreditRating(formData.creditScore);

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{ marginBottom: '1.5rem' }}>
        {customer ? 'Edit Customer' : 'Add New Customer'}
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label>Full Name *:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={inputStyle('name')}
            placeholder="John Smith"
          />
          {errors.name && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.name}</div>}
        </div>
        <div>
          <label>Email *:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={inputStyle('email')}
            placeholder="john.smith@email.com"
          />
          {errors.email && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.email}</div>}
        </div>
        <div>
          <label>Phone *:</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            style={inputStyle('phone')}
            placeholder="(555) 123-4567"
          />
          {errors.phone && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.phone}</div>}
        </div>
        <div>
          <label>Credit Score *:</label>
          <input
            type="number"
            min="300"
            max="850"
            value={formData.creditScore}
            onChange={(e) => setFormData({...formData, creditScore: e.target.value})}
            style={inputStyle('creditScore')}
            placeholder="650"
          />
          <div style={{ 
            fontSize: '0.8rem', 
            marginTop: '0.25rem', 
            color: creditRating.color,
            fontWeight: '500'
          }}>
            {creditRating.text} ({formData.creditScore})
          </div>
          {errors.creditScore && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.creditScore}</div>}
        </div>
        <div>
          <label>Employment:</label>
          <input
            type="text"
            value={formData.employment}
            onChange={(e) => setFormData({...formData, employment: e.target.value})}
            style={styles.input}
            placeholder="Software Engineer, Teacher, etc."
          />
        </div>
        <div>
          <label>Monthly Income:</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.monthlyIncome}
            onChange={(e) => setFormData({...formData, monthlyIncome: e.target.value})}
            style={inputStyle('monthlyIncome')}
            placeholder="5000"
          />
          {errors.monthlyIncome && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.monthlyIncome}</div>}
        </div>
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <label>Address:</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          style={styles.input}
          placeholder="123 Main St, City, State, ZIP"
        />
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <label>Notes:</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          style={{...styles.input, height: '80px', resize: 'vertical'}}
          placeholder="Customer notes, payment history, preferences..."
        />
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button type="submit" style={{...styles.button, ...styles.buttonSuccess}}>
          {customer ? 'Update Customer' : 'Add Customer'}
        </button>
        <button type="button" onClick={onCancel} style={{...styles.button, ...styles.buttonSecondary}}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;