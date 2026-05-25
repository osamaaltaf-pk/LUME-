import { supabase } from '../config/supabase.js';
import { sendOrderUpdateEmail } from '../utils/emailService.js';

// Helper to format order database objects for frontend compatibility
const formatOrder = (o) => {
  if (!o) return null;
  return {
    _id: o.id,
    id: o.id,
    orderNumber: o.order_number,
    total: Number(o.total),
    status: o.status,
    shippingAddress: o.shipping_address,
    paymentMethod: o.payment_method,
    paymentStatus: o.payment_status,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
    user: o.users ? {
      _id: o.user_id,
      id: o.user_id,
      name: o.users.username,
      email: o.users.email,
      username: o.users.username
    } : o.user_id,
    items: (o.order_items || []).map(i => ({
      _id: i.id,
      id: i.id,
      product: i.product_id,
      name: i.name,
      price: Number(i.price),
      quantity: i.quantity,
      isCustom: i.is_custom,
      color: i.color,
      scent: i.scent,
      size: i.size,
      colorName: i.color_name,
      scentName: i.scent_name,
      sizeName: i.size_name,
      shape: i.shape,
      shapeName: i.shape_name
    }))
  };
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.user.user_id;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Shipping address and payment method are required' });
    }

    // Calculate total
    let total = 0;
    for (const item of items) {
      total += Number(item.price) * Number(item.quantity || 1);
    }

    // 1. Insert order (PostgreSQL will generate order_number automatically via sequence default!)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        status: 'processing',
        payment_status: paymentMethod === 'cod' ? 'pending' : 'completed'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Map items and insert bulk
    const orderItemsData = items.map(item => ({
      order_id: order.id,
      product_id: item.isCustom ? null : item._id || item.id || null,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity || 1),
      is_custom: item.isCustom || false,
      color: item.color,
      scent: item.scent,
      size: item.size,
      color_name: item.colorName,
      scent_name: item.scentName,
      size_name: item.sizeName,
      shape: item.shape,
      shape_name: item.shapeName
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) throw itemsError;

    // 3. Fetch the fully populated order
    const { data: populatedOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*, users(username, email), order_items(*)')
      .eq('id', order.id)
      .single();

    if (fetchError) throw fetchError;

    res.status(201).json({
      message: 'Order created successfully',
      order: formatOrder(populatedOrder)
    });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedOrders = orders.map(o => formatOrder(o));
    res.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, users(username, email), order_items(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedOrders = orders.map(o => formatOrder(o));
    res.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Update order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, users(username, email), order_items(*)')
      .single();

    if (error) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const formattedOrder = formatOrder(order);

    // Send status update email
    if (formattedOrder.user && formattedOrder.user.email) {
      sendOrderUpdateEmail(formattedOrder.user.email, formattedOrder.orderNumber, status, formattedOrder.user.username)
        .catch(err => console.error('Failed to send order update email:', err));
    }

    res.json({
      message: 'Order status updated successfully',
      order: formattedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, users(username, email), order_items(*)')
      .eq('id', id)
      .maybeSingle();

    if (error || !order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const formattedOrder = formatOrder(order);

    // Check if user owns the order or is admin
    const isOwner = formattedOrder.user && (formattedOrder.user === req.user.user_id || formattedOrder.user.id === req.user.user_id || formattedOrder.user._id === req.user.user_id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(formattedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

// Delete order (Admin or Owner)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const isOwner = order.user_id === req.user.user_id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied. You can only delete your own orders.' });
    }

    const { error: deleteError } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
};