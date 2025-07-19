import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { testApiConnection } from '../utils/api';
import './Login.css';

export default function Login() {
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Checking connection...');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Test API connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testApiConnection();
        setConnectionStatus(result.message);
      } catch (err) {
        setConnectionStatus('Connection test failed');
      }
    };
    checkConnection();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', { account_number: accountNumber });
      
      const res = await api.post('/auth/login', {
        account_number: accountNumber,
        password,
      });
      
      console.log('Login successful:', res.data);
      
      if (res.data.token && res.data.refreshToken && res.data.user) {
        login(res.data.token, res.data.refreshToken, res.data.user);
        navigate('/dashboard');
      } else {
        setError('Invalid response from server - missing tokens');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response) {
        // Server responded with error
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        // Network error
        setError('Network error - please check your connection and try again');
      } else {
        // Other error
        setError('Login failed - please try again');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-logo">💸</div>
        <h2>Login</h2>
        {error && <div className="login-error">{error}</div>}
        <div className="login-field">
          <label>Account Number</label>
          <input
            type="text"
            value={accountNumber}
            onChange={e => setAccountNumber(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="login-field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" className="login-btn" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        
        {/* Debug info for testing */}
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
          <p><strong>Connection Status:</strong> {connectionStatus}</p>
          <p><strong>Test Account:</strong></p>
          <p>Account: 1234567890</p>
          <p>Password: testpassword</p>
        </div>
      </form>
    </div>
  );
} 