const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth Service', () => {
  describe('OTP Login', () => {
    it('should send OTP for valid phone number', async () => {
      const res = await request(app)
        .post('/api/auth/otp/send')
        .send({ phoneNumber: '+919876543210' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.verificationId).toBeDefined();
    });

    it('should reject invalid phone number', async () => {
      const res = await request(app)
        .post('/api/auth/otp/send')
        .send({ phoneNumber: 'invalid' });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });

  describe('OTP Verification', () => {
    it('should verify valid OTP and create user', async () => {
      // First send OTP
      const otpRes = await request(app)
        .post('/api/auth/otp/send')
        .send({ phoneNumber: '+919876543210' });

      // Then verify OTP
      const res = await request(app)
        .post('/api/auth/otp/verify')
        .send({
          verificationId: otpRes.body.data.verificationId,
          code: '123456' // Mock OTP code
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user).toBeDefined();
    });

    it('should reject invalid OTP', async () => {
      const res = await request(app)
        .post('/api/auth/otp/verify')
        .send({
          verificationId: 'invalid',
          code: '000000'
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Guest Login', () => {
    it('should create guest user with device info', async () => {
      const res = await request(app)
        .post('/api/auth/guest')
        .send({
          deviceId: 'test-device-123',
          deviceType: 'mobile'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.userId).toBeDefined();
      expect(res.body.data.isGuest).toBe(true);
    });

    it('should reject guest login without device info', async () => {
      const res = await request(app)
        .post('/api/auth/guest')
        .send({});

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Profile Update', () => {
    let testUser;
    let authToken;

    beforeEach(async () => {
      // Create a test user
      testUser = await User.create({
        clerkId: 'test-clerk-id',
        email: 'test@example.com',
        role: 'customer',
        profile: {
          firstName: 'Test',
          lastName: 'User'
        }
      });

      // Mock auth token
      authToken = 'mock-jwt-token';
    });

    it('should update user profile with valid data', async () => {
      const res = await request(app)
        .patch(`/api/auth/profile/${testUser._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          profile: {
            firstName: 'Updated',
            lastName: 'Name'
          }
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.profile.firstName).toBe('Updated');
    });

    it('should reject profile update without auth token', async () => {
      const res = await request(app)
        .patch(`/api/auth/profile/${testUser._id}`)
        .send({
          profile: {
            firstName: 'Updated'
          }
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid profile data', async () => {
      const res = await request(app)
        .patch(`/api/auth/profile/${testUser._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          profile: {
            phone: 'invalid-phone'
          }
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });
}); 