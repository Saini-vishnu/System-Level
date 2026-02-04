// API Service for communicating with backend
class APIService {
  constructor(baseURL = 'http://localhost:5000/api') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
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

  isAuthenticated() {
    return !!this.token;
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API REQUEST FAILED');
      }

      return data;
    } catch (error) {
      console.error('API ERROR:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(username, email, password) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async logout() {
    this.clearToken();
  }

  // System data endpoints
  async getSystemData() {
    return this.request('/system/data');
  }

  async syncSystemData(state) {
    return this.request('/system/data/sync', {
      method: 'POST',
      body: JSON.stringify({ state })
    });
  }

  async addLog(logEntry) {
    return this.request('/system/data/log', {
      method: 'POST',
      body: JSON.stringify({ logEntry })
    });
  }

  async addViolation(violation) {
    return this.request('/system/data/violation', {
      method: 'POST',
      body: JSON.stringify({ violation })
    });
  }

  async updateDailyTarget(dailyTarget) {
    return this.request('/system/data/target', {
      method: 'PUT',
      body: JSON.stringify({ dailyTarget })
    });
  }

  async getLogs() {
    return this.request('/system/data/logs');
  }

  async getViolations() {
    return this.request('/system/data/violations');
  }

  // Health check
  async healthCheck() {
    try {
      return await this.request('/health');
    } catch (error) {
      return { success: false, message: 'SERVER OFFLINE' };
    }
  }
}

export default APIService;
