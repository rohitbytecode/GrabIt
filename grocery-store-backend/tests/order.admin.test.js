import request from 'supertest';
import app from '../src/app.js';
import { connectDB, closeDB, clearDB } from './setup.js';
import User from '../src/models/User.js';
import Order from '../src/models/Order.js';

let adminToken;
let userToken;
let userId;

beforeAll(async () => await connectDB());
beforeEach(async () => {
    // create regular user
    const userRes = await request(app).post('/api/auth/register').send({
        name: 'Regular', email: 'regular@example.com', password: 'password'
    });
    userToken = userRes.body.token;
    userId = userRes.body.user.id;

    // create admin user
    const admin = await User.create({
        name: 'Admin', email: 'admin@example.com', password: 'adminpass', role: 'admin'
    });
    const loginRes = await request(app).post('/api/auth/login').send({
        email: 'admin@example.com', password: 'adminpass'
    });
    adminToken = loginRes.body.token;
});
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe('Admin Order API', () => {
    it('should allow admin to fetch all orders', async () => {
        // create order for user
        await Order.create({ userId, items: [], total: 0 });

        const res = await request(app)
            .get('/api/orders')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(1);
    });

    it('should forbid non-admin from fetching all orders', async () => {
        const res = await request(app)
            .get('/api/orders')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toBe(403);
    });

    it('should allow admin to update order status', async () => {
        const order = await Order.create({ userId, items: [], total: 0 });
        const res = await request(app)
            .put(`/api/orders/${order._id}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 'processing' });
        expect(res.statusCode).toBe(200);
        expect(res.body.data.status).toBe('processing');
    });

    it('should reject invalid status values', async () => {
        const order = await Order.create({ userId, items: [], total: 0 });
        const res = await request(app)
            .put(`/api/orders/${order._id}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 'unknown' });
        expect(res.statusCode).toBe(400);
    });
});
