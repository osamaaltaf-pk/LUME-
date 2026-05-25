import React, { useState, useEffect } from 'react';
import { orderServices } from '../services/orderServices';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const allOrders = await orderServices.getAllOrders();
        console.log('📦 Fetched orders:', allOrders); // Debug log
        setOrders(allOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderServices.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.status === filter);

  // Safe data access functions
  const getCustomerName = (order) => {
    return order.user?.name || order.user?.username || 'Unknown Customer';
  };

  const getCustomerEmail = (order) => {
    return order.user?.email || 'No email';
  };

  const getOrderItems = (order) => {
    return order.items || [];
  };

  const getShippingAddress = (order) => {
    return order.shippingAddress || {};
  };

  return (

    <div className="bg-classic min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-semibold main text-text-main mb-3">Order Registry</h1>
          <div className="w-16 h-1 bg-accent-gold mx-auto mb-4 rounded-full"></div>
          <p className="sub text-gray-600">Track and fulfill the requests of your patrons.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 uppercase tracking-wide border ${filter === status
                ? 'bg-accent-gold text-white border-accent-gold shadow-md'
                : 'bg-transparent text-gray-600 border-gray-300 hover:border-accent-gold hover:text-accent-gold'
                }`}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold mx-auto"></div>
            <p className="mt-4 text-gray-500 font-light tracking-widest uppercase">Retrieving Records...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="admin-card p-16 text-center">
            <i className="fa-solid fa-folder-open text-6xl text-gray-200 mb-6 block"></i>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Records Found</h3>
            <p className="text-gray-500 font-light">The registry is currently empty for this filter.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredOrders.map((order) => (
              <div key={order._id} className="admin-card overflow-hidden transition-all hover:shadow-lg">
                <div className="bg-secondary-bg/50 px-6 py-4 border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-2 rounded-full w-10 h-10 flex items-center justify-center text-accent-gold shadow-sm">
                        <i className="fa-solid fa-receipt"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-main font-mono text-sm tracking-wide">
                          #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                        </h3>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          }) : 'Unknown date'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                      <span className="text-xl font-bold text-accent-gold">
                        Rs. {order.total ? order.total.toFixed(0) : '0'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                      <h4 className="sub text-lg text-text-main mb-4 border-b border-gray-100 pb-2">Artifacts</h4>
                      <div className="space-y-4">
                        {getOrderItems(order).map((item, index) => (
                          <div key={item._id || index} className="flex justify-between items-start bg-white p-4 rounded-lg border border-gray-50">
                            <div className="flex gap-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                                <i className={`fa-solid ${item.isCustom ? 'fa-wand-magic-sparkles' : 'fa-candle-holder'}`}></i>
                              </div>
                              <div>
                                <p className="font-medium text-text-main">{item.name || 'Unnamed Item'}</p>

                                {item.isCustom ? (
                                  <div className="text-sm text-gray-500 mt-1 space-y-1">
                                    <p><span className="text-accent-gold text-xs uppercase mr-2">Custom Piece</span></p>
                                    <p className="text-xs">
                                      {item.shapeName} • {item.colorName} • {item.scentName} • {item.sizeName}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 mt-1">Standard Collection</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-text-main">
                                Rs. {item.price ? (item.price * (item.quantity || 1)).toFixed(0) : '0'}
                              </p>
                              <p className="text-xs text-gray-400">Qty: {item.quantity || 1}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping & Actions */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="mb-6">
                        <h4 className="sub text-lg text-text-main mb-3 flex items-center gap-2">
                          <i className="fa-solid fa-map-location-dot text-gray-400 text-sm"></i> Destination
                        </h4>
                        <div className="text-sm text-gray-600 space-y-2 bg-white p-4 rounded-lg border border-gray-100">
                          <p className="font-semibold text-gray-800">{getShippingAddress(order).name}</p>
                          <p>{getShippingAddress(order).address}</p>
                          <p>
                            {getShippingAddress(order).city}, {getShippingAddress(order).state} {getShippingAddress(order).zipCode}
                          </p>
                          <p>{getShippingAddress(order).country}</p>
                          <div className="pt-2 mt-2 border-t border-gray-100 text-xs text-gray-500">
                            <i className="fa-solid fa-phone mr-2"></i>{getShippingAddress(order).phone}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="sub text-lg text-text-main mb-3">Status Control</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {['processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                            <button
                              key={status}
                              onClick={() => updateOrderStatus(order._id, status)}
                              disabled={order.status === status}
                              className={`px-3 py-2 text-xs font-semibold rounded-md transition-all uppercase tracking-wide ${order.status === status
                                ? 'bg-gray-800 text-white cursor-not-allowed opacity-50'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-accent-gold hover:text-accent-gold'
                                }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <button
                            onClick={async () => {
                              if (window.confirm('Delete this order permanently? This action cannot be undone.')) {
                                try {
                                  await orderServices.deleteOrder(order._id);
                                  setOrders(prev => prev.filter(o => o._id !== order._id));
                                } catch (e) { alert('Failed to delete order'); }
                              }
                            }}
                            className="w-full py-2 text-xs text-red-500 font-bold uppercase tracking-wider border border-red-200 rounded-md hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <i className="fa-solid fa-trash-can"></i> Delete Record
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

};

export default AdminOrders;