import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import cartRoutes from './routes/cart.js';
import contactRoutes from './routes/contact.js';

const app = express();

app.use(cors ({
    origin: "*",
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use(morgan('dev', {
    skip: (req) => req.url === '/health'
}));

app.get('/', (_req, res) => {
    res.status(200).json({
        message: "Backend is online"
    })
});

app.get('/health', (_req, res) => {
    res.status(200).json({
        status: "ok",
        service: "grocery-store-backend",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/contact', contactRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
});

export default app;