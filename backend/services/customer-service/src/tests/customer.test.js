const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Customer API', () => {
  it('GET /api/customers should return all customers', async () => {
    const res = await request(app).get('/api/customers');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/customers should create a new customer', async () => {
    const customerData = {
      name: 'Test Customer',
      email: 'test@example.com',
      location: {
        coordinates: [0, 0]
      }
    };
    const res = await request(app).post('/api/customers').send(customerData);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(customerData.name);
  });
}); 