const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const headers = {
  'Content-Type': 'application/json',
};

const getAuthToken = () => localStorage.getItem('authToken');

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: { ...headers },
    ...options,
  };

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const api = {
  get: (endpoint) => apiCall(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiCall(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => apiCall(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => apiCall(endpoint, { method: 'DELETE' }),
  setToken: setAuthToken,
  getToken: getAuthToken,
};

export default api;
