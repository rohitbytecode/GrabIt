import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

cartItemSchema.virtual('subtotal').get(function () {
    if (this.populated('product') && this.product.price != null) {
        return this.product.price * this.quantity;
    }
    return undefined;
});

const CartItem = mongoose.model('CartItem', cartItemSchema);
export default CartItem;
