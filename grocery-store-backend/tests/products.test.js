import request from 'supertest';
import app from '../src/app.js';
import { connectDB, closeDB, clearDB } from './setup.js';
import Product from '../src/models/Product.js';

let product1;

beforeAll(async () => await connectDB());

beforeEach(async () => {
    product1 = await Product.create({
        name: 'Apple',
        price: 1.5,
        inStock: true,
        featured: true
    });
});

afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe('Products API', () => {
    describe('GET /api/products', () => {
        it('should fetch all products with pagination', async () => {
            const res = await request(app).get('/api/products');

            expect(res.statusCode).toEqual(200);
            expect(res.body.data.length).toBeGreaterThan(0);
            expect(res.body.data[0].name).toEqual('Apple');
            expect(res.body.total).toEqual(1);
        });
    });

    describe('GET /api/products/featured', () => {
        it('should fetch featured products', async () => {
            const res = await request(app).get('/api/products/featured');

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0].featured).toEqual(true);
        });
    });

    describe('GET /api/products/:id', () => {
        it('should fetch a product by id', async () => {
            const res = await request(app).get(`/api/products/${product1._id}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toEqual('Apple');
        });

        it('should return 404 for invalid product id', async () => {
            const res = await request(app).get('/api/products/60d21b4667d0d8992e610c85'); // Valid ObjectId structure, but non-existent

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual('Product not found');
        });
    });
});
