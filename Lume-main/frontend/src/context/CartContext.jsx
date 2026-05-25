import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);

  // Load cart from localStorage when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const userCartKey = `cart_${user.user_id}`;
      const savedCart = localStorage.getItem(userCartKey);
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error parsing cart data:', error);
          setItems([]);
        }
      } else {
        setItems([]);
      }
    } else {
      setItems([]);
    }
  }, [user, isAuthenticated]);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (isAuthenticated && user) {
      const userCartKey = `cart_${user.user_id}`;
      localStorage.setItem(userCartKey, JSON.stringify(items));
    }
  }, [items, user, isAuthenticated]);

  const addToCart = (product) => {
    setItems(prev => {
      const existingItem = prev.find(item => item._id === product._id && !item.isCustom);
      const existingCustomItem = prev.find(item =>
        item.isCustom &&
        item.color === product.color &&
        item.scent === product.scent &&
        item.size === product.size
      );

      if (existingItem && !product.isCustom) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      } else if (existingCustomItem && product.isCustom) {
        return prev.map(item =>
          item.isCustom &&
            item.color === product.color &&
            item.scent === product.scent &&
            item.size === product.size
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: product.quantity || 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};