import { rest } from 'msw';

// Get the base URL for the API
const baseUrl = 'http://localhost:8000/api';

// Sample user for authentication
const sampleUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  role: 'user'
};

// Sample customers
const sampleCustomers = [
  {
    id: 1,
    name: 'Acme Inc.',
    email: 'contact@acme.com',
    phone: '123-456-7890',
    company: 'Acme Corporation',
    status: 'active',
    created_at: '2023-01-15T12:00:00Z'
  },
  {
    id: 2,
    name: 'Beta Corp',
    email: 'info@beta.com',
    phone: '987-654-3210',
    company: 'Beta Ltd.',
    status: 'active',
    created_at: '2023-02-20T12:00:00Z'
  }
];

// Sample interactions
const sampleInteractions = [
  {
    id: 1,
    customer_id: 1,
    user_id: 1,
    type: 'call',
    description: 'Initial sales call',
    date: '2023-05-10T10:00:00Z',
    user_name: 'Test User',
    notes: 'Discussed product features and pricing',
    duration: 30
  },
  {
    id: 2,
    customer_id: 1,
    user_id: 1,
    type: 'email',
    description: 'Follow-up email',
    date: '2023-05-11T15:00:00Z',
    user_name: 'Test User',
    notes: 'Sent detailed pricing information'
  }
];

// Define API handlers
export const handlers = [
  // Auth handlers
  rest.post(`${baseUrl}/users/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          accessToken: 'fake-access-token',
          user: sampleUser
        }
      })
    );
  }),

  rest.post(`${baseUrl}/users/register`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: {
          accessToken: 'fake-access-token',
          user: sampleUser
        }
      })
    );
  }),

  rest.get(`${baseUrl}/users/me`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          user: sampleUser
        }
      })
    );
  }),

  // Customer handlers
  rest.get(`${baseUrl}/customers`, (req, res, ctx) => {
    // Support query parameters for filtering
    const limit = Number(req.url.searchParams.get('limit')) || 20;
    const offset = Number(req.url.searchParams.get('offset')) || 0;
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          customers: sampleCustomers,
          total: sampleCustomers.length,
          limit,
          offset
        }
      })
    );
  }),

  rest.get(`${baseUrl}/customers/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const customer = sampleCustomers.find(c => c.id === Number(id));
    
    if (!customer) {
      return res(
        ctx.status(404),
        ctx.json({
          success: false,
          error: {
            message: 'Customer not found',
            type: 'NotFoundError'
          }
        })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: customer
      })
    );
  }),

  rest.post(`${baseUrl}/customers`, (req, res, ctx) => {
    const newCustomer = {
      ...req.body,
      id: sampleCustomers.length + 1,
      created_at: new Date().toISOString()
    };
    
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: newCustomer
      })
    );
  }),

  // Interaction handlers
  rest.get(`${baseUrl}/interactions/customer/:customerId`, (req, res, ctx) => {
    const { customerId } = req.params;
    const customerInteractions = sampleInteractions.filter(
      i => i.customer_id === Number(customerId)
    );
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          interactions: customerInteractions,
          total: customerInteractions.length,
          limit: 20,
          offset: 0
        }
      })
    );
  }),

  rest.get(`${baseUrl}/interactions/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const interaction = sampleInteractions.find(i => i.id === Number(id));
    
    if (!interaction) {
      return res(
        ctx.status(404),
        ctx.json({
          success: false,
          error: {
            message: 'Interaction not found',
            type: 'NotFoundError'
          }
        })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: interaction
      })
    );
  })
];