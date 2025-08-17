import React, { useState } from 'react';
import { styles } from '../../styles/styles';

const VehicleForm = ({ vehicle, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    vin: vehicle?.vin || '',
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    mileage: vehicle?.mileage || 0,
    color: vehicle?.color || '',
    price: vehicle?.price || 0,
    condition: vehicle?.condition || 'Good',
    features: vehicle?.features?.join(', ') || '',
    description: vehicle?.description || '',
    status: vehicle?.status || 'Available'
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.vin.trim()) newErrors.vin = 'VIN is required';
    if (!formData.make.trim()) newErrors.make = 'Make is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Please enter a valid year';
    }
    if (formData.mileage < 0) newErrors.mileage = 'Mileage cannot be negative';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const vehicleData = {
      ...formData,
      year: parseInt(formData.year),
      mileage: parseInt(formData.mileage),
      price: parseFloat(formData.price),
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      dateAdded: vehicle?.dateAdded || new Date().toISOString().split('T')[0],
      id: vehicle?.id
    };
    onSave(vehicleData);
  };

  const inputStyle = (fieldName) => ({
    ...styles.input,
    borderColor: errors[fieldName] ? '#ef4444' : '#d1d5db'
  });

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{ marginBottom: '1.5rem' }}>
        {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label>VIN *:</label>
          <input
            type="text"
            value={formData.vin}
            onChange={(e) => setFormData({...formData, vin: e.target.value})}
            style={inputStyle('vin')}
            placeholder="Vehicle Identification Number"
          />
          {errors.vin && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.vin}</div>}
        </div>
        <div>
          <label>Make *:</label>
          <input
            type="text"
            value={formData.make}
            onChange={(e) => setFormData({...formData, make: e.target.value})}
            style={inputStyle('make')}
            placeholder="Toyota, Honda, Ford..."
          />
          {errors.make && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.make}</div>}
        </div>
        <div>
          <label>Model *:</label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) => setFormData({...formData, model: e.target.value})}
            style={inputStyle('model')}
            placeholder="Camry, Civic, F-150..."
          />
          {errors.model && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.model}</div>}
        </div>
        <div>
          <label>Year *:</label>
          <input
            type="number"
            min="1900"
            max={new Date().getFullYear() + 1}
            value={formData.year}
            onChange={(e) => setFormData({...formData, year: e.target.value})}
            style={inputStyle('year')}
          />
          {errors.year && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.year}</div>}
        </div>
        <div>
          <label>Mileage *:</label>
          <input
            type="number"
            min="0"
            value={formData.mileage}
            onChange={(e) => setFormData({...formData, mileage: e.target.value})}
            style={inputStyle('mileage')}
            placeholder="25000"
          />
          {errors.mileage && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.mileage}</div>}
        </div>
        <div>
          <label>Color:</label>
          <input
            type="text"
            value={formData.color}
            onChange={(e) => setFormData({...formData, color: e.target.value})}
            style={styles.input}
            placeholder="Silver, Blue, Red..."
          />
        </div>
        <div>
          <label>Price *:</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            style={inputStyle('price')}
            placeholder="24999"
          />
          {errors.price && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.price}</div>}
        </div>
        <div>
          <label>Condition:</label>
          <select
            value={formData.condition}
            onChange={(e) => setFormData({...formData, condition: e.target.value})}
            style={styles.input}
          >
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </div>
        <div>
          <label>Status:</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            style={styles.input}
          >
            <option value="Available">Available</option>
            <option value="Financed">Financed</option>
            <option value="Sold">Sold</option>
            <option value="Reserved">Reserved</option>
          </select>
        </div>
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <label>Features (comma separated):</label>
        <input
          type="text"
          value={formData.features}
          onChange={(e) => setFormData({...formData, features: e.target.value})}
          style={styles.input}
          placeholder="Bluetooth, Backup Camera, Heated Seats, Apple CarPlay"
        />
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <label>Description:</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          style={{...styles.input, height: '80px', resize: 'vertical'}}
          placeholder="Vehicle description, condition notes, maintenance history..."
        />
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button type="submit" style={{...styles.button, ...styles.buttonSuccess}}>
          {vehicle ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
        <button type="button" onClick={onCancel} style={{...styles.button, ...styles.buttonSecondary}}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;