import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { styles } from '../../styles/styles';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { state, dispatch } = useApp();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = state.users.find(u => 
      u.username === credentials.username && u.password === credentials.password
    );
    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    }}>
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '12px', 
        width: '400px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)' 
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>🚗 CarDeal Pro</h1>
        {error && (
          <div style={{ 
            background: '#fee2e2', 
            color: '#991b1b', 
            padding: '0.75rem', 
            borderRadius: '8px', 
            marginBottom: '1rem' 
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Username:</label>
            <input 
              type="text" 
              value={credentials.username} 
              onChange={(e) => setCredentials({...credentials, username: e.target.value})} 
              style={styles.input}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Password:</label>
            <input 
              type="password" 
              value={credentials.password} 
              onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={{...styles.button, ...styles.buttonPrimary, width: '100%'}}>
            Sign In
          </button>
        </form>
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          <p><strong>Demo:</strong> admin/admin123 or sales1/sales123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;