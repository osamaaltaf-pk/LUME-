import express from 'express'

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js'

import verifyAccessToken from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js'


const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin only routes
router.post('/', verifyAccessToken, adminMiddleware, upload.array('images', 5), createProduct);
router.put('/:id', verifyAccessToken, adminMiddleware, updateProduct);
router.delete('/:id', verifyAccessToken, adminMiddleware, deleteProduct);

export default router