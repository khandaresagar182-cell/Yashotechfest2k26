import axios from 'axios';

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Registration API
export const registrationAPI = {
    create: (data) => api.post('/registration/create', data),
    verifyPayment: (data) => api.post('/registration/verify-payment', data),
    paymentFailed: (data) => api.post('/registration/payment-failed', data),
    checkEmail: (email) => api.get(`/registration/check-email/${email}`)
};


export default api;
