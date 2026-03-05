import { createOrder } from '../services/payment.service.js';
import crypto from 'crypto';

export const createPaymentOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const order = await createOrder(amount);

    res.status(200).json({
      success: true,
      order,
      keyId: process.env.RAZORPAY_KEY_ID // Return the public key to the frontend
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Verify Razorpay payment signature
 * This endpoint verifies that the payment came from Razorpay
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment details' });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        verified: true
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        verified: false
      });
    }
  } catch (error) {
    next(error);
  }
};
