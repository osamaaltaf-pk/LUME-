import express from 'express';
import {
  getCustomizations,
  addCustomization,
  updateCustomization,
  deleteCustomization,
  createCustomizedProduct
} from '../controllers/customizationController.js';
import verifyAccessToken from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCustomizations);

// User routes
router.post('/create-candle', verifyAccessToken, createCustomizedProduct);

// Admin routes
router.post('/', verifyAccessToken, adminMiddleware, addCustomization);
router.put('/:id', verifyAccessToken, adminMiddleware, updateCustomization);
router.delete('/:id', verifyAccessToken, adminMiddleware, deleteCustomization);

export default router;