// Mock environment variables
process.env.PORT = 4002;
process.env.MONGODB_URI = 'mongodb://localhost:27017/quicklocal-auth-test';
process.env.CLERK_SECRET_KEY = 'test_clerk_secret_key';
process.env.NODE_ENV = 'test';

// Increase timeout for tests
jest.setTimeout(30000);

// Mock console methods to keep test output clean
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
}; 