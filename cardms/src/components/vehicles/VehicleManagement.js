import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { styles } from '../../styles/styles';

const VehicleManagement = () => {
  const { state, dispatch } = useApp();
  
  const filteredVehicles = state.vehicles.filter(vehicle =>
    vehicle.make.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    vehicle.vin.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    vehicle.color.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  const handleEdit = (vehicle) => {
    dispatch({ type: 'SHOW_MODAL', payload: { type: 'editVehicle', item: vehicle } });
  };

  const handleDelete = (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      dispatch({ type: 'DELETE_VEHICLE', payload: vehicleId });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return { background: '#dcfce7', color: '#166534' };
      case 'Financed': return { background: '#e0e7ff', color: '#5b21b6' };
      case 'Sold': return { background: '#f3e8ff', color: '#7c2d12' };
      case 'Reserved': return { background: '#fef3c7', color: '#92400e' };
      default: return { background: '#f3f4f6', color: '#374151' };
    }
  };

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
          <h2 style={{ margin: 0 }}>Vehicle Management</h2>
          <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
            Manage your vehicle inventory ({filteredVehicles.length} vehicles)
          </p>
        </div>
        <button 
          style={{...styles.button, ...styles.buttonPrimary}}
          onClick={() => dispatch({ type: 'SHOW_MODAL', payload: { type: 'addVehicle' } })}
        >
          + Add Vehicle
        </button>
      </div>
      
      {/* Search and Filter Bar */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <input
            type="text"
            placeholder="Search vehicles by make, model, VIN, or color..."
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

      {/* Vehicle Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '1.5rem' 
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {state.vehicles.filter(v => v.status === 'Available').length}
          </div>
          <div style={{ fontSize: '0.8rem', opacity: '0.9' }}>Available</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {state.vehicles.filter(v => v.status === 'Financed').length}
          </div>
          <div style={{ fontSize: '0.8rem', opacity: '0.9' }}>Financed</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            {formatCurrency(state.vehicles.reduce((sum, v) => sum + v.price, 0))}
          </div>
          <div style={{ fontSize: '0.8rem', opacity: '0.9' }}>Total Value</div>
        </div>
      </div>

      {/* Vehicle Table */}
      <div style={styles.card}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Vehicle</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Year</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Mileage</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Condition</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Price</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map(vehicle => (
                <tr key={vehicle.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                        {vehicle.make} {vehicle.model}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {vehicle.color} • {vehicle.vin}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>{vehicle.year}</td>
                  <td style={{ padding: '1rem' }}>{formatNumber(vehicle.mileage)}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      background: vehicle.condition === 'Excellent' ? '#dcfce7' : 
                                 vehicle.condition === 'Good' ? '#dbeafe' : 
                                 vehicle.condition === 'Fair' ? '#fef3c7' : '#fee2e2',
                      color: vehicle.condition === 'Excellent' ? '#166534' : 
                             vehicle.condition === 'Good' ? '#1d4ed8' : 
                             vehicle.condition === 'Fair' ? '#92400e' : '#dc2626'
                    }}>
                      {vehicle.condition}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>
                    {formatCurrency(vehicle.price)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      ...getStatusColor(vehicle.status)
                    }}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button 
                        onClick={() => handleEdit(vehicle)}
                        style={{
                          ...styles.button, 
                          ...styles.buttonPrimary, 
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.8rem'
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(vehicle.id)}
                        style={{
                          ...styles.button, 
                          ...styles.buttonDanger, 
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.8rem'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredVehicles.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              color: '#6b7280' 
            }}>
              {state.searchTerm ? 
                `No vehicles found matching "${state.searchTerm}".` : 
                'No vehicles in inventory. Add your first vehicle!'
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleManagement;