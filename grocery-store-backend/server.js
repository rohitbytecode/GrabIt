import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.json({ message: 'Backend is online' });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
})

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});