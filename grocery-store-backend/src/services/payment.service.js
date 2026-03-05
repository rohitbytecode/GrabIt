import razorpayInstance from '../config/razorpay.js';

export const createOrder = async (amount) => {
  const razorpay = razorpayInstance();
  
  if (!razorpay) {
    throw new Error("Razorpay not available");
  }

  const options = {
    amount: amount * 100,
    currency: 'INR',
    receipt: `receipt_${Date.now()}`
  };

  const order = await razorpay.orders.create(options);
  return order;
};