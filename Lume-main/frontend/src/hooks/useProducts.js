import { useState, useEffect } from 'react';
import { productServices } from '../services/products.js';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productServices.getProducts();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      await productServices.createProduct(productData);
      await fetchProducts(); // Refresh list
      return true;
    } catch (error) {
      console.error('Error creating product:', error);
      return false;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      await productServices.updateProduct(id, productData);
      await fetchProducts(); // Refresh list
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  };

  const removeProduct = async (productId) => {
    try {
      await productServices.deleteProduct(productId);
      await fetchProducts(); // Refresh list
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    addProduct,
    removeProduct,
    updateProduct
  };
};