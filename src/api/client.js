// API Client for CryptoSolve Exchange
const API_BASE_URL = 'https://backend-nine-nu-98.vercel.app/api'; // Production backend on Vercel

class CryptoSolveAPI {
  constructor() {
    this.token = localStorage.getItem('authToken') || null;
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
    };
  }

  async handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `API Error: ${response.status}`);
    }
    return data;
  }

  // Auth APIs
  async signup(email, password, confirmPassword) {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        action: 'signup',
        email,
        password,
        confirmPassword,
      }),
    });
    const data = await this.handleResponse(response);
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        action: 'login',
        email,
        password,
      }),
    });
    const data = await this.handleResponse(response);
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async logout() {
    this.clearToken();
  }

  // Wallet APIs
  async getWallet() {
    const response = await fetch(`${API_BASE_URL}/wallet`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async generateDepositAddress(currency = 'USDT') {
    const response = await fetch(`${API_BASE_URL}/wallet`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ currency }),
    });
    return this.handleResponse(response);
  }

  // Order APIs
  async getOrders() {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async placeOrder(side, orderType, price, amount) {
    const totalCost = price * amount;
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        side,
        orderType,
        price,
        amount,
        totalCost,
      }),
    });
    return this.handleResponse(response);
  }

  async cancelOrder(orderId) {
    const response = await fetch(`${API_BASE_URL}/orders?orderId=${orderId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async fillOrder(orderId, buyerAddress = null) {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/fill`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ buyerAddress }),
    });
    return this.handleResponse(response);
  }

  // Orderbook API
  async getOrderBook() {
    const response = await fetch(`${API_BASE_URL}/orderbook`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Price API
  async getPrice() {
    const response = await fetch(`${API_BASE_URL}/price`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // P2P APIs
  async getP2PAds() {
    const response = await fetch(`${API_BASE_URL}/p2p`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createP2PAd(side, rate, minLimit, maxLimit, paymentMethods) {
    const response = await fetch(`${API_BASE_URL}/p2p`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        side,
        rate,
        minLimit,
        maxLimit,
        paymentMethods,
      }),
    });
    return this.handleResponse(response);
  }

  async initiateP2PTrade(adId, amount) {
    const response = await fetch(`${API_BASE_URL}/p2p/${adId}/trade`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ adId, amount }),
    });
    return this.handleResponse(response);
  }

  // KYC APIs
  async submitKYC(selfieImage, aadhaarImage, fullName, dateOfBirth) {
    const response = await fetch(`${API_BASE_URL}/kyc`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        selfieImage,
        aadhaarImage,
        fullName,
        dateOfBirth,
      }),
    });
    return this.handleResponse(response);
  }

  async getKYCStatus() {
    const response = await fetch(`${API_BASE_URL}/kyc`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Withdrawal APIs
  async withdrawINR(amount, upiId) {
    const response = await fetch(`${API_BASE_URL}/withdraw`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        type: 'inr',
        amount,
        upiId,
      }),
    });
    return this.handleResponse(response);
  }

  async withdrawUSDT(amount, toAddress) {
    const response = await fetch(`${API_BASE_URL}/withdraw`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        type: 'usdt',
        amount,
        toAddress,
      }),
    });
    return this.handleResponse(response);
  }
}

// Create global API instance
const api = new CryptoSolveAPI();
