import express from 'express';
import { protect } from '../middleware/authmiddleware.js';
import { createOrder, getMyOrders } from '../controllers/orderController.js';

const router = express.Router();

// only authenticated users can place or view their orders
router.post('/', protect, createOrder);
router.get('/me', protect, getMyOrders);

export default router;
