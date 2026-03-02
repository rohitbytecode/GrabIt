import Order from '../models/Order.js';

// create a new order (cash payment only)
export const createOrder = async (req, res) => {
    try {
        const { items, total, deliveryAddress } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
        }

        const order = await Order.create({
            userId: req.user.id,
            items,
            total,
            deliveryAddress,
            paymentMethod: 'cash',
            status: 'pending'
        });

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
