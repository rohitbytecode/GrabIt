import request from 'supertest';
import app from '../src/app.js';
import { connectDB, closeDB, clearDB } from './setup.js';
import User from '../src/models/User.js';
import Product from '../src/models/Product.js';
import CartItem from '../src/models/CartItem.js';

let token;
let user;
let product1;

beforeAll(async () => {
    await connectDB();
});

beforeEach(async () => {
    // Create User and get token
    const res = await request(app).post('/api/auth/register').send({
        name: 'Cart User', email: 'cart@example.com', password: 'password123'
    });
    token = res.body.token;
    user = res.body.user;

    // Create Test Product
    product1 = await Product.create({
        name: 'Apple',
        price: 1.5,
        inStock: true
    });
});

afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe('Cart API', () => {
    describe('POST /api/cart', () => {
        it('should add a product to the cart', async () => {
            const res = await request(app)
                .post('/api/cart')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    productId: product1._id,
                    quantity: 2
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.product.toString()).toEqual(product1._id.toString());
            expect(res.body.data.quantity).toEqual(2);
        });

        it('should protect the cart route without a token', async () => {
            const res = await request(app)
                .post('/api/cart')
                .send({
                    productId: product1._id,
                    quantity: 2
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('Not authorized, no token');
        });
    });

    describe('DELETE /api/cart/:itemId', () => {
        it('should remove a product from the cart', async () => {
            // Add Item First
            const item = await CartItem.create({
                user: user.id,
                product: product1._id,
                quantity: 1
            });

            const res = await request(app)
                .delete(`/api/cart/${item._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);

            // Verify item was deleted using findById
            const deletedItem = await CartItem.findById(item._id);
            expect(deletedItem).toBeNull();
        });
    });
});
