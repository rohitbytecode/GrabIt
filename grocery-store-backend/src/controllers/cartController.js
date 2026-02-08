import CartItem from '../models/CartItem.js';
import Product from '../models/Product.js';

const getCart = async (req, res) => {
    const items = await CartItem.find({ user: req.user.id }).populate('product');
    const mapped = items.map(i => ({ id: i._id, product: i.product, quantity: i.quantity, subtotal: i.product ? i.product.price * i.quantity : undefined }));
    res.json(mapped);
};

const addToCart = async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const existing = await CartItem.findOne({ user: req.user.id, product: productId });
    if (existing) {
        existing.quantity += Number(quantity);
        await existing.save();
        return res.json({ success: true, data: existing });
    }
    const item = await CartItem.create({ user: req.user.id, product: productId, quantity });
    res.json({ success: true, data: item });
};

const updateCartItem = async (req, res) => {
    const { quantity } = req.body;
    const item = await CartItem.findById(req.params.itemId);
    if (!item) return res.status(404).json({ success:false, message: 'Cart item not found' });
    if (String(item.user) !== String(req.user.id)) return res.status(403).json({ success:false, message:'Not allowed' });
    item.quantity = Number(quantity);
    await item.save();
    res.json({ success: true, data: item });
};

const removeFromCart = async (req, res) => {
    const item = await CartItem.findById(req.params.itemId);
    if (!item) return res.status(404).json({ success:false, message: 'Cart item not found' });
    if (String(item.user) !== String(req.user.id)) return res.status(403).json({ success:false, message:'Not allowed' });
    await item.remove();
    res.json({ success: true });
};

const clearCart = async (req, res) => {
    await CartItem.deleteMany({ user: req.user.id });
    res.json({ success: true });
};

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
