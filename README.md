# CRM System Prototype

A simple CRM (Customer Relationship Management) system with React frontend and Express backend.

## Features

- User authentication with JWT
- Customer management
- Interaction tracking
- Dashboard with key metrics
- Role-based access control

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Material-UI for components
- Axios for API calls

### Backend
- Express.js with TypeScript
- SQLite database
- JWT for authentication
- RESTful API design

## Project Structure

```
crm/
├── frontend/           # React frontend
│   ├── public/         # Static files
│   └── src/            # Source code
│       ├── components/ # React components
│       ├── services/   # API services
│       ├── pages/      # Page components
│       ├── layouts/    # Layout components
│       └── utils/      # Utility functions
│
└── backend/            # Express backend
    ├── src/            # Source code
    │   ├── config/     # Configuration files
    │   ├── controllers/# Request controllers
    │   ├── models/     # Data models
    │   ├── routes/     # API routes
    │   └── middleware/ # Custom middleware
    └── dist/           # Compiled JavaScript
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies
   ```
   npm install
   cd frontend && npm install
   cd backend && npm install
   ```

3. Start development servers
   ```
   npm start
   ```
   This will start both the frontend and backend servers concurrently.

### Development

- Frontend runs on http://localhost:3000
- Backend runs on http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer (admin only)

### Interactions
- `GET /api/interactions/:id` - Get interaction by ID
- `GET /api/interactions/customer/:customerId` - Get interactions by customer ID
- `POST /api/interactions` - Create new interaction
- `PUT /api/interactions/:id` - Update interaction
- `DELETE /api/interactions/:id` - Delete interaction