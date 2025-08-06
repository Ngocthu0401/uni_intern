const axios = require('axios');
const colors = require('colors');
const config = require('./config');

class ApiClient {
    constructor() {
        this.baseURL = config.baseURL;
        this.timeout = config.timeout;
        this.tokens = {};
        
        // Create axios instance
        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: this.timeout,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        // Response interceptor for logging
        this.client.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                if (error.response) {
                    console.log(`❌ ${error.response.status} ${error.response.statusText}`.red);
                    if (error.response.data) {
                        console.log(`   ${JSON.stringify(error.response.data, null, 2)}`.gray);
                    }
                }
                return Promise.reject(error);
            }
        );
    }
    
    // Set authentication token
    setToken(role, token) {
        this.tokens[role] = token;
    }
    
    // Get authentication header
    getAuthHeaders(role) {
        if (!this.tokens[role]) {
            throw new Error(`No token found for role: ${role}`);
        }
        return {
            'Authorization': `Bearer ${this.tokens[role]}`
        };
    }
    
        // Authentication endpoints (NO AUTH HEADERS)
    async register(userData) {
        const response = await this.client.post('/auth/signup', userData);
        return response.data;
    }

    async login(credentials) {
        const response = await this.client.post('/auth/signin', credentials);
        if (response.data.token) {
            // Store token based on user role (you'll need to determine role)
            this.setToken('default', response.data.token);
        }
        return response.data;
    }
    
    // Generic CRUD operations
    async get(endpoint, role = 'department', params = {}) {
        const response = await this.client.get(endpoint, {
            headers: this.getAuthHeaders(role),
            params: params
        });
        return response.data;
    }
    
    async post(endpoint, data, role = 'department') {
        const response = await this.client.post(endpoint, data, {
            headers: this.getAuthHeaders(role)
        });
        return response.data;
    }
    
    async put(endpoint, data, role = 'department') {
        const response = await this.client.put(endpoint, data, {
            headers: this.getAuthHeaders(role)
        });
        return response.data;
    }
    
    async delete(endpoint, role = 'department') {
        const response = await this.client.delete(endpoint, {
            headers: this.getAuthHeaders(role)
        });
        return response.data;
    }
    
    // Test endpoint accessibility without authentication
    async testUnauthenticated(endpoint, method = 'GET') {
        try {
            let response;
            switch (method.toUpperCase()) {
                case 'GET':
                    response = await this.client.get(endpoint);
                    break;
                case 'POST':
                    response = await this.client.post(endpoint, {});
                    break;
                case 'PUT':
                    response = await this.client.put(endpoint, {});
                    break;
                case 'DELETE':
                    response = await this.client.delete(endpoint);
                    break;
                default:
                    throw new Error(`Unsupported method: ${method}`);
            }
            return { success: true, status: response.status, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                status: error.response?.status || 0,
                error: error.response?.data || error.message 
            };
        }
    }
    
    // Test endpoint with wrong role
    async testUnauthorized(endpoint, wrongRole, method = 'GET', data = null) {
        try {
            let response;
            const headers = this.getAuthHeaders(wrongRole);
            
            switch (method.toUpperCase()) {
                case 'GET':
                    response = await this.client.get(endpoint, { headers });
                    break;
                case 'POST':
                    response = await this.client.post(endpoint, data || {}, { headers });
                    break;
                case 'PUT':
                    response = await this.client.put(endpoint, data || {}, { headers });
                    break;
                case 'DELETE':
                    response = await this.client.delete(endpoint, { headers });
                    break;
                default:
                    throw new Error(`Unsupported method: ${method}`);
            }
            return { success: true, status: response.status, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                status: error.response?.status || 0,
                error: error.response?.data || error.message 
            };
        }
    }
    
    // Utility method to wait
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Public endpoints (no authentication required)
    async publicPost(endpoint, data) {
        const response = await this.client.post(endpoint, data);
        return response.data;
    }

    async publicGet(endpoint, params = {}) {
        const response = await this.client.get(endpoint, { params });
        return response.data;
    }

    // Health check
    async healthCheck() {
        try {
            // Try to access a public endpoint or health endpoint
            const response = await axios.get(`${this.baseURL}/../actuator/health`, {
                timeout: 5000
            });
            return { healthy: true, status: response.status };
        } catch (error) {
            // If health endpoint doesn't exist, try base URL
            try {
                const response = await axios.get(this.baseURL.replace('/api', ''), {
                    timeout: 5000
                });
                return { healthy: true, status: response.status };
            } catch (err) {
                return { healthy: false, error: err.message };
            }
        }
    }
}

module.exports = ApiClient; 