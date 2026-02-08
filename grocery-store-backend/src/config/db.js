import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@freshmart.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const existing = await User.findOne({ email: adminEmail });
        if (!existing) {
            await User.create({ name: 'Admin', email: adminEmail, password: adminPassword, role: 'admin' });
            console.log('Default admin user created:', adminEmail);
        }

        // Seed sample categories and featured products if none exist
        const catCount = await Category.countDocuments();
        if (catCount === 0) {
            const cats = await Category.create([
                { name: 'Fruits', description: 'Fresh fruits', image: 'https://via.placeholder.com/400x300?text=Fruits' },
                { name: 'Vegetables', description: 'Fresh vegetables', image: 'https://via.placeholder.com/400x300?text=Vegetables' }
            ]);
            console.log('Seeded categories:', cats.map(c=>c.name).join(', '));

            const products = [
                { name: 'Fresh Apples', description: 'Crispy and sweet apples', price: 120, category: 'Fruits', categoryId: cats[0]._id, image: 'https://via.placeholder.com/400x300?text=Apples', stock: 50, inStock: true, featured: true, unit: 'kg' },
                { name: 'Bananas', description: 'Ripe bananas', price: 60, category: 'Fruits', categoryId: cats[0]._id, image: 'https://via.placeholder.com/400x300?text=Bananas', stock: 80, inStock: true, featured: true, unit: 'kg' },
                { name: 'Carrots', description: 'Organic carrots', price: 40, category: 'Vegetables', categoryId: cats[1]._id, image: 'https://via.placeholder.com/400x300?text=Carrots', stock: 30, inStock: true, featured: false, unit: 'kg' }
            ];
            await Product.create(products);
            console.log('Seeded sample products (including featured items).');
        }

    } catch (err) {
        console.log('DB connection failed', err);
        process.exit(1);
    }
};

export default connectDB;