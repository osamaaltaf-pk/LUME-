import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderServices } from '../services/orderServices';

const CheckoutForm = ({ cartItems, total, onBack, onOrderSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentMethod: 'cod' // Default to COD for now as it's easier for users
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        items: cartItems,
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod
      };

      // Create order via API
      await orderServices.createOrder(orderData);

      alert('Order placed successfully. Thank you for choosing Lume.');
      onOrderSuccess();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-classic py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="main text-3xl text-text-main">Checkout</h2>
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-accent-dark font-medium transition-colors uppercase tracking-wider text-xs"
          >
            ← Return to Collection
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div className="glass-card p-8 h-fit rounded-xl order-2 lg:order-1">
            <h3 className="sub text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Your Selection</h3>
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {cartItems.map(item => (
                <div key={item._id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-text-main main text-lg">{item.name}</p>
                    {item.isCustom && (
                      <p className="text-xs text-gray-500 italic">
                        {item.colorName} • {item.scentName} • {item.sizeName}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-accent-dark">
                    Rs. {(item.price * item.quantity).toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-6 mt-4">
              <div className="flex justify-between items-center text-2xl font-bold text-text-main main">
                <span>Total</span>
                <span>Rs. {total.toFixed(0)}</span>
              </div>
              <p className="text-xs text-gray-400 text-right mt-1">Including all taxes</p>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="glass-card p-8 rounded-xl order-1 lg:order-2">
            <h3 className="sub text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <i className="fa-solid fa-truck-fast text-accent-gold"></i> Shipping Details
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-classic w-full"
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-classic w-full"
                  placeholder="+92 300 1234567"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="input-classic w-full"
                  placeholder="House #, Street, Area"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="input-classic w-full"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                    Province/State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="input-classic w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="zipCode" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="input-classic w-full"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="input-classic w-full"
                    defaultValue="Pakistan"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Payment Method
                </label>
                <div className="space-y-3">
                  {/* COD Only */}
                  <label className="flex items-center p-3 border rounded-lg border-accent-gold bg-accent-sage/10 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={true}
                      readOnly
                      className="h-4 w-4 text-accent-dark focus:ring-accent-gold border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-800 font-medium">Cash on Delivery</span>
                    <i className="fa-solid fa-money-bill-wave ml-auto text-gray-400"></i>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 rounded-lg shadow-lg mt-6"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    Processing...
                  </div>
                ) : (
                  `Confirm Order - Rs. ${total.toFixed(0)}`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;