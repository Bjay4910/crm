import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CRM API Documentation',
      version: '1.0.0',
      description: 'API documentation for the CRM system',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'CRM Support',
        url: 'https://crm-support.example.com',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the user',
            },
            username: {
              type: 'string',
              description: 'The username of the user',
            },
            email: {
              type: 'string',
              description: 'The email of the user',
            },
            password: {
              type: 'string',
              description: 'The password of the user',
              format: 'password',
            },
            role: {
              type: 'string',
              description: 'The role of the user',
              enum: ['user', 'admin'],
              default: 'user',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the user was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the user was last updated',
            },
          },
        },
        Customer: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the customer',
            },
            name: {
              type: 'string',
              description: 'The name of the customer',
            },
            email: {
              type: 'string',
              description: 'The email of the customer',
            },
            phone: {
              type: 'string',
              description: 'The phone number of the customer',
            },
            company: {
              type: 'string',
              description: 'The company the customer belongs to',
            },
            status: {
              type: 'string',
              description: 'The status of the customer',
              enum: ['active', 'inactive', 'lead', 'opportunity'],
              default: 'active',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the customer was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the customer was last updated',
            },
          },
        },
        Interaction: {
          type: 'object',
          required: ['customerId', 'type', 'details'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the interaction',
            },
            customerId: {
              type: 'integer',
              description: 'The id of the customer this interaction is with',
            },
            type: {
              type: 'string',
              description: 'The type of interaction',
              enum: ['call', 'email', 'meeting', 'note', 'other'],
            },
            details: {
              type: 'string',
              description: 'The details of the interaction',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'The date of the interaction',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the interaction was recorded',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the interaction was last updated',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              description: 'Error status',
              example: 'error',
            },
            statusCode: {
              type: 'integer',
              description: 'HTTP status code',
              example: 400,
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Invalid input data',
            },
            details: {
              type: 'object',
              description: 'Additional error details',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              description: 'Status of the response',
              example: 'success',
            },
            accessToken: {
              type: 'string',
              description: 'JWT access token',
            },
            user: {
              type: 'object',
              description: 'User information',
              properties: {
                id: {
                  type: 'integer',
                  description: 'User ID',
                },
                username: {
                  type: 'string',
                  description: 'Username',
                },
                email: {
                  type: 'string',
                  description: 'User email',
                },
                role: {
                  type: 'string',
                  description: 'User role',
                  enum: ['user', 'admin'],
                },
              },
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                status: 'error',
                statusCode: 401,
                message: 'Unauthorized: Invalid or missing token',
              },
            },
          },
        },
        ForbiddenError: {
          description: 'Not enough permissions to access resource',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                status: 'error',
                statusCode: 403,
                message: 'Forbidden: Insufficient permissions',
              },
            },
          },
        },
        BadRequestError: {
          description: 'Invalid request data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                status: 'error',
                statusCode: 400,
                message: 'Invalid input data',
                details: {
                  email: 'Invalid email format',
                },
              },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                status: 'error',
                statusCode: 404,
                message: 'Resource not found',
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Path to the API docs
  apis: ['./src/routes/*.ts', './src/models/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;