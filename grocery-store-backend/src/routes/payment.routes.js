import express from 'express';
import { createPaymentOrder, verifyPayment } from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/create-payment', createPaymentOrder);
router.post('/verify-payment', verifyPayment);

export default router;