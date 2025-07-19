import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Login.css';

export default function Login() {
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const res = await api.post('/auth/login', {
        account_number: accountNumber,
        password,
      });
      
      if (res.data.token && res.data.refreshToken && res.data.user) {
        login(res.data.token, res.data.refreshToken, res.data.user);
        navigate('/dashboard');
      } else {
        setError('Invalid response from server - missing tokens');
      }
    } catch (err) {
      
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
      </form>
    </div>
  );
} 