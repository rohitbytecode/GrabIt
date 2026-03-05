import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Contact from '../models/Contact.js';

// Get comprehensive dashboard metrics
export const getDashboardMetrics = async (req, res) => {
    try {
        // User metrics
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });

        // Order metrics
        const totalOrders = await Order.countDocuments();
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const totalRevenue = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        // Recent orders (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentOrders = await Order.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        // Product metrics
        const totalProducts = await Product.countDocuments();
        const inStockProducts = await Product.countDocuments({ inStock: true });
        const outOfStockProducts = await Product.countDocuments({ inStock: false });
        const featuredProducts = await Product.countDocuments({ featured: true });
        const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10, $gt: 0 } });

        // Category metrics
        const totalCategories = await Category.countDocuments();

        // Contact metrics
        const totalContacts = await Contact.countDocuments();

        // Revenue by month (last 12 months)
        const revenueByMonth = await Order.aggregate([
            {
                $match: {
                    status: { $ne: 'cancelled' },
                    createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    revenue: { $sum: '$total' },
                    orders: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': -1, '_id.month': -1 }
            },
            { $limit: 12 }
        ]);

        // Top selling products
        const topSellingProducts = await Order.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    name: { $first: '$items.name' },
                    totalSold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: '$items.subtotal' }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 10 }
        ]);

        // Recent orders with user details
        const recentOrderDetails = await Order.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .limit(5)
            .select('orderNumber total status createdAt userId');

        const metrics = {
            users: {
                totalCustomers: totalUsers,
                totalAdmins: totalAdmins,
                totalUsers: totalUsers + totalAdmins
            },
            orders: {
                totalOrders,
                ordersByStatus: ordersByStatus.reduce((acc, status) => {
                    acc[status._id] = status.count;
                    return acc;
                }, {}),
                totalRevenue: totalRevenue[0]?.total || 0,
                recentOrders,
                revenueByMonth,
                recentOrderDetails
            },
            products: {
                totalProducts,
                inStockProducts,
                outOfStockProducts,
                featuredProducts,
                lowStockProducts,
                topSellingProducts
            },
            categories: {
                totalCategories
            },
            contacts: {
                totalContacts
            }
        };

        res.status(200).json({
            success: true,
            data: metrics
        });
    } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Get specific metric types (for optimization)
export const getUserMetrics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });

        res.status(200).json({
            success: true,
            data: {
                totalCustomers: totalUsers,
                totalAdmins: totalAdmins,
                totalUsers: totalUsers + totalAdmins
            }
        });
    } catch (err) {
        console.error('Error fetching user metrics:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getOrderMetrics = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const totalRevenue = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                ordersByStatus: ordersByStatus.reduce((acc, status) => {
                    acc[status._id] = status.count;
                    return acc;
                }, {}),
                totalRevenue: totalRevenue[0]?.total || 0
            }
        });
    } catch (err) {
        console.error('Error fetching order metrics:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getProductMetrics = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const inStockProducts = await Product.countDocuments({ inStock: true });
        const outOfStockProducts = await Product.countDocuments({ inStock: false });
        const featuredProducts = await Product.countDocuments({ featured: true });
        const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10, $gt: 0 } });

        res.status(200).json({
            success: true,
            data: {
                totalProducts,
                inStockProducts,
                outOfStockProducts,
                featuredProducts,
                lowStockProducts
            }
        });
    } catch (err) {
        console.error('Error fetching product metrics:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};