import { api } from './api';

export const productServices = {
  // Get all products
  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  // Create product with file upload
  createProduct: async (formData) => { // Change to accept FormData
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file upload
      },
    });
    return response.data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};