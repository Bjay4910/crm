// Set up for tests
process.env.NODE_ENV = 'test';

// Mock the database module
jest.mock('./config/database', () => ({
  initializeDatabase: jest.fn().mockResolvedValue(true),
  pool: {
    query: jest.fn()
  }
}));

// Global teardown after all tests
afterAll(async () => {
  // Clean up any resources if needed
});