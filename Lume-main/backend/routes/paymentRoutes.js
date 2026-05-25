import express from 'express';
import { cashOnDelivery } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/cash-on-delivery', cashOnDelivery);

export default router;
