import axios from 'axios'
import { api } from './api.js'

export const authService = {
  login: async (email, password) => {

    const response = await api.post('/auth/login', { email, password });
    return response.data
  },

  signup: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data
  },

  verifyOtp: async (data) => {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  logout: async (refreshToken) => {
    const response = await api.post('/auth/logout', { refreshToken });
    return response.data
  }
}