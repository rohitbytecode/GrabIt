import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import User from '../../src/models/User.js';
import path from 'path';
import fs from 'fs';

// Helper to clean up
const clearUsers = async () => {
    await User.deleteMany({});
};

describe('Profile Module Integration Tests', () => {
    let token;
    let user;
    const testPassword = 'Password123!';

    beforeAll(async () => {
        // Use an entirely in-memory or distinct test db if possible. Standard is using the current connection created by setup.
        // I will connect directly to testdb based on environment
        const url = `mongodb://127.0.0.1/grocery-store-test-profile`;
        await mongoose.connect(url);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await clearUsers();

        // Create a user
        user = new User({
            name: 'Test Profile User',
            email: 'profileuser@test.com',
            password: testPassword,
            role: 'user'
        });
        await user.save();

        // Simulate login (get token)
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'profileuser@test.com',
                password: testPassword
            });
        
        token = loginRes.body.token; 
    });

    describe('GET /api/profile', () => {
        it('should return 401 if not authenticated', async () => {
            const res = await request(app).get('/api/profile');
            expect(res.statusCode).toBe(401);
            expect(res.body.message).toMatch(/Not authorized/i);
        });

        it('should return the user profile if authenticated', async () => {
            const res = await request(app)
                .get('/api/profile')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user).toBeDefined();
            expect(res.body.user.name).toBe('Test Profile User');
            expect(res.body.user.email).toBe('profileuser@test.com');
            // Password shouldn't be included
            expect(res.body.user.password).toBeUndefined();
        });
    });

    describe('PUT /api/profile', () => {
        it('should update user fields successfully', async () => {
            const updateData = {
                name: 'Updated Name',
                phoneNumber: '1234567890',
                address: {
                    city: 'Test City',
                    country: 'Test Country'
                },
                gender: 'male',
                dateOfBirth: '1990-01-01'
            };

            const res = await request(app)
                .put('/api/profile')
                .set('Authorization', `Bearer ${token}`)
                .send(updateData);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user.name).toBe('Updated Name');
            expect(res.body.user.phoneNumber).toBe('1234567890');
            expect(res.body.user.address.city).toBe('Test City');
            expect(res.body.user.gender).toBe('male');
        });

        it('should partially update address without overwriting existing fields', async () => {
            // Setup initial address
            await request(app)
                .put('/api/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    address: {
                        street: '123 Test St',
                        city: 'Test City'
                    }
                });

            // Update only state
            const res = await request(app)
                .put('/api/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    address: {
                        state: 'Test State'
                    }
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.user.address.street).toBe('123 Test St'); // Kept original
            expect(res.body.user.address.state).toBe('Test State');   // Added new
        });
    });

    describe('PUT /api/profile/password', () => {
        it('should return 400 if current or new password not provided', async () => {
            const res = await request(app)
                .put('/api/profile/password')
                .set('Authorization', `Bearer ${token}`)
                .send({ currentPassword: testPassword }); // Missing new password

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should return 400 if current password is incorrect', async () => {
            const res = await request(app)
                .put('/api/profile/password')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    currentPassword: 'wrongpassword',
                    newPassword: 'NewPassword123!'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toMatch(/Incorrect current password/i);
        });

        it('should successfully change password', async () => {
            const res = await request(app)
                .put('/api/profile/password')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    currentPassword: testPassword,
                    newPassword: 'NewPassword123!'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);

            // Verify login with new password
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'profileuser@test.com',
                    password: 'NewPassword123!'
                });
            
            expect(loginRes.statusCode).toBe(200);
        });
    });

    describe('POST /api/profile/picture', () => {
        it('should return 400 if no image is uploaded', async () => {
            const res = await request(app)
                .post('/api/profile/picture')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(400);
        });

        it('should successfully upload a profile picture', async () => {
            // Create a dummy file
            const dummyFilePath = path.join(__dirname, 'dummy.jpg');
            fs.writeFileSync(dummyFilePath, 'dummy image content');

            const res = await request(app)
                .post('/api/profile/picture')
                .set('Authorization', `Bearer ${token}`)
                .attach('profilePicture', dummyFilePath);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.profilePicture).toMatch(/^\/uploads\//);

            // Cleanup dummy file
            fs.unlinkSync(dummyFilePath);
            // Cleanup uploaded file
            const uploadedPath = path.join(process.cwd(), res.body.profilePicture);
            if (fs.existsSync(uploadedPath)) {
                fs.unlinkSync(uploadedPath);
            }
        });
    });
});
