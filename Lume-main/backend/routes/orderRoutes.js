import express from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  deleteOrder
} from '../controllers/orderController.js';
import verifyAccessToken from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

// User routes
router.post('/', verifyAccessToken, createOrder);
router.get('/my-orders', verifyAccessToken, getUserOrders);
router.get('/:id', verifyAccessToken, getOrderById);

// Admin routes
router.get('/', verifyAccessToken, adminMiddleware, getAllOrders);
router.put('/:id/status', verifyAccessToken, adminMiddleware, updateOrderStatus);
router.delete('/:id', verifyAccessToken, deleteOrder);

export default router;