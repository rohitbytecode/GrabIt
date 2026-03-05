import Order from '../models/Order.js';

// create a new order (supports both cod and online payment)
export const createOrder = async (req, res) => {
    try {
        const { items, total, deliveryAddress, paymentMethod, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
        }

        // Determine payment method (default to cod)
        const selectedPaymentMethod = paymentMethod && ['cod', 'online'].includes(paymentMethod) ? paymentMethod : 'cod';

        // Validate online payment details
        if (selectedPaymentMethod === 'online' && (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature)) {
            return res.status(400).json({ success: false, message: 'Online payment requires Razorpay details' });
        }

        // items may include image property from client
        const orderData = {
            userId: req.user.id,
            items,
            total,
            deliveryAddress,
            paymentMethod: selectedPaymentMethod,
            status: selectedPaymentMethod === 'online' ? 'processing' : 'pending'
        };

        // Add Razorpay details for online payments
        if (selectedPaymentMethod === 'online') {
            orderData.razorpayOrderId = razorpayOrderId;
            orderData.razorpayPaymentId = razorpayPaymentId;
            orderData.razorpaySignature = razorpaySignature;
        }

        const order = await Order.create(orderData);

        res.status(201).json({ success: true, data: order });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// get orders for the logged-in user
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id });
        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        console.error('Error fetching user orders:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ADMIN - fetch all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email');
        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        console.error('Error fetching all orders:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ADMIN - update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        if (!['pending', 'processing', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.status = status;
        await order.save();
        res.status(200).json({ success: true, data: order });
    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};
