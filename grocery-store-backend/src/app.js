import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(cors ({
    origin: "*",
    credentials: true
}));

app.use(express.json());

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

app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'     
    });
});

export default app;