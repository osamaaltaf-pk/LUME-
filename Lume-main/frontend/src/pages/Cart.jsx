import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CheckoutForm from '../components/CheckoutForm';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-classic py-20 flex items-center justify-center">
        <div className="glass-card p-10 max-w-lg text-center mx-4 rounded-xl">
          <h2 className="main text-2xl mb-4 text-text-main">Welcome to Your Atelier</h2>
          <p className="sub text-gray-600 mb-6">Please sign in to access your curated collection.</p>
          <Link to="/login" className="btn-primary py-3 px-8 rounded-full inline-block">Sign In</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !showCheckout) {
    return (
      <div className="min-h-screen bg-classic py-20 flex items-center justify-center">
        <div className="glass-card p-12 max-w-lg text-center mx-4 rounded-xl">
          <div className="text-accent-sage mb-6">
            <i className="fa-solid fa-basket-shopping text-6xl opacity-50"></i>
          </div>
          <h2 className="main text-3xl text-text-main mb-2">Your Collection is Empty</h2>
          <p className="sub text-gray-500 mb-8 italic">"The empty vessel waits to be filled with light."</p>
          <Link
            to="/products"
            className="btn-primary py-3 px-8 rounded-full inline-block"
          >
            Explore Aromas
          </Link>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <CheckoutForm
        cartItems={items}
        total={getCartTotal()}
        onBack={() => setShowCheckout(false)}
        onOrderSuccess={() => {
          clearCart();
          setShowCheckout(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-classic py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="main text-4xl text-text-main mb-2">Your Selection</h2>
          <div className="w-16 h-1 bg-accent-sage mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {items.map(item => (
              <div key={item._id} className="glass-card p-6 flex flex-col sm:flex-row items-center gap-6 rounded-lg transition-transform hover:-translate-y-1 duration-300">

                {/* Image Placeholder or Actual Image */}
                <div className="w-24 h-24 bg-secondary-bg rounded-md flex items-center justify-center text-accent-sage flex-shrink-0">
                  {item.images && item.images[0] ? (
                    <img
                      src={
                        item.images[0].startsWith('http') || item.images[0].startsWith('data:')
                          ? item.images[0]
                          : `${(import.meta.env.VITE_API_URL || 'https://backend-nine-pi-24.vercel.app/api').replace('/api', '')}/${item.images[0]}`
                      }
                      alt={item.name}
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/eaddcf/5c4033?text=N/A'; }}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <i className={`fa-solid ${item.isCustom ? 'fa-wand-magic-sparkles' : 'fa-candle-holder'} text-2xl`}></i>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h4 className="main text-xl text-text-main mb-1">
                    {item.name}
                  </h4>

                  {item.isCustom ? (
                    <div className="text-xs text-gray-500 space-y-1 mb-2 font-light">
                      <span className="inline-block px-2 py-0.5 bg-accent-sage/10 text-accent-dark rounded-full mb-1 uppercase tracking-wider text-[10px] font-bold">Bespoke</span>
                      <p>{item.shapeName || 'Classic'} • {item.sizeName} • {item.scentName}</p>
                      <div className="flex items-center justify-center sm:justify-start gap-1">
                        <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: item.color }}></div>
                        <span>{item.colorName}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Standard Collection</p>
                  )}

                  <p className="sub text-lg font-bold text-accent-dark">Rs. {item.price}</p>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-full px-2 py-1 bg-white/50">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-accent-dark disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold text-text-main text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-accent-dark"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest border-b border-transparent hover:border-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-8 rounded-xl sticky top-24">
              <h3 className="main text-2xl mb-6 border-b border-gray-100 pb-4">Overview</h3>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span>Rs. {getCartTotal().toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 text-xs uppercase font-bold">Complimentary</span>
                </div>
                <div className="flex justify-between text-xl font-bold main text-accent-dark pt-4 border-t border-gray-100">
                  <span>Total</span>
                  <span>Rs. {getCartTotal().toFixed(0)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full btn-primary py-4 rounded-lg shadow-lg flex items-center justify-center gap-2"
                >
                  Confirm Order <i className="fa-solid fa-arrow-right"></i>
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-xs text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors"
                >
                  Empty Cart
                </button>
              </div>

              {/* Custom Item Note */}
              {items.some(item => item.isCustom) && (
                <div className="mt-8 bg-accent-sage/10 p-4 rounded-lg border border-accent-sage/20">
                  <p className="text-xs text-accent-dark leading-relaxed">
                    <i className="fa-solid fa-wand-magic-sparkles mr-1"></i>
                    <strong>Note:</strong> Your bespoke pieces require 3-5 days for curing before they can be dispatched.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;