import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    image: String,
    stock: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    unit: String
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
