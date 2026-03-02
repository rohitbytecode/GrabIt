import express from 'express';
import { protect, authorize } from '../middleware/authmiddleware.js';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

// only authenticated users can place or view their orders
router.post('/', protect, createOrder);
router.get('/me', protect, getMyOrders);

// admin-only endpoints
router.get('/', protect, authorize('admin'), getAllOrders);
router.put('/:orderId/status', protect, authorize('admin'), updateOrderStatus);

export default router;
