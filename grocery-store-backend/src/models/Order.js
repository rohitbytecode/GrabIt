import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },
            image: { type: String },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            subtotal: { type: Number, required: true }
        }
    ],
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'processing', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: { 
        type: String, 
        enum: ['cod', 'online'],
        default: 'cod' 
    },
    // Payment details for online payments
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    deliveryAddress: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', OrderSchema);
