import request from 'supertest';
import app from '../src/app.js';
import { connectDB, closeDB, clearDB } from './setup.js';
import User from '../src/models/User.js';
import Product from '../src/models/Product.js';

let token;
let user;
let product1;

beforeAll(async () => await connectDB());
beforeEach(async () => {
    const res = await request(app).post('/api/auth/register').send({
        name: 'Order User',
        email: 'order@example.com',
        password: 'password123'
    });
    token = res.body.token;
    user = res.body.user;

    product1 = await Product.create({ name: 'Banana', price: 0.75, inStock: true });
});
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe('Order API', () => {
    describe('POST /api/orders', () => {
        it('should create an order when user is authenticated', async () => {
            const orderData = {
                items: [
                    {
                        productId: product1._id,
                        name: 'Banana',
                        price: 0.75,
                        quantity: 4,
                        subtotal: 3
                    }
                ],
                total: 3,
                deliveryAddress: '123 Main St'
            };

            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${token}`)
                .send(orderData);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.userId).toEqual(user.id);
            expect(res.body.data.items.length).toBe(1);
            expect(res.body.data.paymentMethod).toBe('cash');
        });

        it('should reject creating order without authentication', async () => {
            const res = await request(app)
                .post('/api/orders')
                .send({ items: [], total: 0 });

            expect(res.statusCode).toBe(401);
        });
    });
});
