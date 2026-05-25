import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderServices } from '../services/orderServices';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const userOrders = await orderServices.getUserOrders();
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-classic py-20 flex items-center justify-center">
        <div className="glass-card p-10 max-w-lg text-center mx-4 rounded-xl">
          <h2 className="main text-2xl font-bold text-text-main">Please login to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-classic py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Profile Header */}
        <div className="glass-card p-8 mb-10 flex flex-col md:flex-row items-center gap-6 rounded-xl">
          <div className="w-20 h-20 bg-accent-gold rounded-full flex items-center justify-center text-white text-3xl font-heading shadow-md ring-4 ring-white/50">
            {user ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold main text-text-main">{user.username || 'User'}</h1>
            <p className="sub text-gray-600 tracking-wide">{user.email}</p>
            <div className="mt-2 inline-block px-3 py-1 bg-accent-gold/20 text-accent-dark text-xs font-bold uppercase tracking-widest rounded-full">
              Patron
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold main text-text-main">Order History</h2>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-gold mx-auto"></div>
              <p className="mt-4 text-gray-500 font-light uppercase tracking-widest">Retrieving Records...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-xl">
              <div className="text-gray-300 mb-4">
                <i className="fa-solid fa-box-open text-6xl"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6 font-light">Your journey with Lume has just begun.</p>
              <Link to="/products" className="btn-primary py-2 px-6 rounded-full inline-block text-xs">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="glass-card overflow-hidden hover:shadow-lg transition-transform duration-300 rounded-lg">
                  {/* Order Header */}
                  <div className="bg-secondary-bg/50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Order Number</p>
                      <h3 className="font-mono text-text-main font-semibold">#{order.orderNumber || order._id.slice(-6).toUpperCase()}</h3>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Placed On</p>
                      <p className="text-sm text-text-main">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown'}
                      </p>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Order Tracking</p>
                      {order.status === 'cancelled' ? (
                        <div className="flex items-center gap-2 text-red-500 bg-red-50 px-3 py-1 rounded-full w-fit">
                          <i className="fa-solid fa-circle-xmark"></i>
                          <span className="text-xs font-bold uppercase tracking-wider">Order Cancelled</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 sm:gap-2">
                          {/* Processing Step */}
                          <div className={`flex flex-col sm:flex-row items-center gap-1 ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'text-accent-gold' : 'text-gray-300'}`}>
                            <i className="fa-solid fa-circle-check text-sm"></i>
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase hidden sm:inline">Processing</span>
                          </div>
                          <div className={`w-6 sm:w-12 h-0.5 ${['shipped', 'delivered'].includes(order.status) ? 'bg-accent-gold' : 'bg-gray-200'}`}></div>

                          {/* Shipped Step */}
                          <div className={`flex flex-col sm:flex-row items-center gap-1 ${['shipped', 'delivered'].includes(order.status) ? 'text-blue-500' : 'text-gray-300'}`}>
                            <i className="fa-solid fa-truck-fast text-sm"></i>
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase hidden sm:inline">Shipped</span>
                          </div>
                          <div className={`w-6 sm:w-12 h-0.5 ${['delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-200'}`}></div>

                          {/* Delivered Step */}
                          <div className={`flex flex-col sm:flex-row items-center gap-1 ${['delivered'].includes(order.status) ? 'text-green-600' : 'text-gray-300'}`}>
                            <i className="fa-solid fa-house-chimney text-sm"></i>
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase hidden sm:inline">Delivered</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total</p>
                      <span className="text-xl font-bold text-accent-dark font-heading">Rs. {order.total ? order.total.toFixed(0) : '0'}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Items */}
                    <div className="mb-6">
                      <h4 className="sub text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Artifacts</h4>
                      <div className="space-y-3">
                        {(order.items || []).map((item, index) => (
                          <div key={item._id || index} className="flex justify-between items-center bg-white/50 p-3 rounded-md border border-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-secondary-bg flex items-center justify-center text-accent-sage">
                                <i className={`fa-solid ${item.isCustom ? 'fa-magic' : 'fa-candle-holder'}`}></i>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-text-main">{item.name || 'Item'}</p>
                                {item.isCustom && <p className="text-[10px] text-gray-500 uppercase">Custom Piece</p>}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">Rs. {item.price}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping */}
                    {order.shippingAddress && (
                      <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                        <h4 className="sub text-xs font-bold text-gray-400 uppercase tracking-widest mb-2"><i className="fa-solid fa-location-dot mr-2"></i>Destination</h4>
                        <p className="text-sm text-gray-600 font-light">
                          <span className="font-semibold block text-gray-800">{order.shippingAddress.name}</span>
                          {order.shippingAddress.address}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                        </p>
                      </div>
                    )}

                    {/* Actions Footer */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                      {(order.status === 'delivered' || order.status === 'cancelled') && (
                        <button
                          onClick={async () => {
                            if (window.confirm('Remove this order from your history?')) {
                              try {
                                await orderServices.deleteOrder(order._id);
                                setOrders(prev => prev.filter(o => o._id !== order._id));
                              } catch (e) { alert('Failed to delete order'); }
                            }
                          }}
                          className="text-xs text-red-400 hover:text-red-600 font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
                        >
                          <i className="fa-solid fa-trash-can"></i> Remove from History
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;