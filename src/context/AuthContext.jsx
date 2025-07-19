import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'));

  useEffect(() => {
    if (token && refreshToken && user) {
      // User is authenticated
    } else {
      setUser(null);
    }
  }, [token, refreshToken, user]);

  const login = (token, refreshToken, userData) => {
    setToken(token);
    setRefreshToken(refreshToken);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const refreshAuthToken = async () => {
    if (!refreshToken) {
      logout();
      return false;
    }

    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      const { token: newToken, refreshToken: newRefreshToken } = response.data;
      
      setToken(newToken);
      setRefreshToken(newRefreshToken);
      localStorage.setItem('token', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 