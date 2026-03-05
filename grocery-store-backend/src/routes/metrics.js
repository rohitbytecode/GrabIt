import express from 'express';
import { protect, authorize } from '../middleware/authmiddleware.js';
import {
    getDashboardMetrics,
    getUserMetrics,
    getOrderMetrics,
    getProductMetrics
} from '../controllers/metricsController.js';

const router = express.Router();

// All metrics routes require admin authentication
router.get('/dashboard', protect, authorize('admin'), getDashboardMetrics);
router.get('/users', protect, authorize('admin'), getUserMetrics);
router.get('/orders', protect, authorize('admin'), getOrderMetrics);
router.get('/products', protect, authorize('admin'), getProductMetrics);

export default router;