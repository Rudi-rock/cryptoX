import api from '../utils/api';

export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  signup: (firstName, lastName, email, password) =>
    api.post('/auth/signup', { firstName, lastName, email, password }),
  
  logout: () =>
    api.post('/auth/logout', {}),
  
  getCurrentUser: () =>
    api.get('/auth/me'),
  
  verifyEmail: (token) =>
    api.post('/auth/verify-email', { token }),
};

export const walletAPI = {
  getWallets: () =>
    api.get('/wallets'),
  
  getWallet: (id) =>
    api.get(`/wallets/${id}`),
  
  createWallet: (walletData) =>
    api.post('/wallets', walletData),
  
  updateWallet: (id, walletData) =>
    api.put(`/wallets/${id}`, walletData),
  
  deleteWallet: (id) =>
    api.delete(`/wallets/${id}`),
};

export const transactionAPI = {
  getTransactions: () =>
    api.get('/transactions'),
  
  getTransaction: (id) =>
    api.get(`/transactions/${id}`),
  
  createTransaction: (transactionData) =>
    api.post('/transactions', transactionData),
};

export const userAPI = {
  getProfile: () =>
    api.get('/user/profile'),
  
  updateProfile: (profileData) =>
    api.put('/user/profile', profileData),
  
  getSettings: () =>
    api.get('/user/settings'),
  
  updateSettings: (settingsData) =>
    api.put('/user/settings', settingsData),
};
