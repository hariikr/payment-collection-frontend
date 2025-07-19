import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Log request for debugging
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  
  return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.error('API Error:', error);
    
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        console.log('Attempting token refresh...');
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
          refreshToken
        });
        
        const { token: newToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('token', newToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // If refresh fails, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Test API connectivity
export const testApiConnection = async () => {
  try {
    const response = await api.get('/auth/login', { timeout: 5000 });
    return { success: true, message: 'API is reachable' };
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return { success: false, message: 'API timeout - server may be down' };
    } else if (error.response) {
      return { success: true, message: 'API is reachable (expected error for GET on login endpoint)' };
    } else {
      return { success: false, message: 'Cannot connect to API - check network and server' };
    }
  }
};

export default api; 