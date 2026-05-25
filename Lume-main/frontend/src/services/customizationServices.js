import { api } from './api';

export const customizationServices = {
  // Get all customization options
  getCustomizations: async () => {
    try {
      const response = await api.get('/customizations');
      return response.data;
    } catch (error) {
      console.error('Error fetching customizations:', error);
      throw error;
    }
  },

  // Create customized candle
  createCustomCandle: async (candleData) => {
    try {
      const response = await api.post('/customizations/create-candle', candleData);
      return response.data;
    } catch (error) {
      console.error('Error creating custom candle:', error);
      throw error;
    }
  },

  // Admin: Add customization option
  addCustomization: async (customizationData) => {
    try {
      const response = await api.post('/customizations', customizationData);
      return response.data;
    } catch (error) {
      console.error('Error adding customization:', error);
      throw error;
    }
  },

  // Admin: Update customization option
  updateCustomization: async (id, customizationData) => {
    try {
      const response = await api.put(`/customizations/${id}`, customizationData);
      return response.data;
    } catch (error) {
      console.error('Error updating customization:', error);
      throw error;
    }
  },

  // Admin: Delete customization option
  deleteCustomization: async (id) => {
    try {
      const response = await api.delete(`/customizations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting customization:', error);
      throw error;
    }
  }
};