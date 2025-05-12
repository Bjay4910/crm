# CRM System Prototype

A simple Customer Relationship Management (CRM) system with a React frontend and Express backend.

## Features

- User authentication with JWT
- Customer management
- Interaction tracking
- Dashboard with key metrics
- Role-based access control

## Tech Stack

### Frontend
- React with TypeScript
- Material UI for components
- React Router for navigation
- Axios for API calls

### Backend
- Express.js with TypeScript
- SQLite database
- JWT for authentication

## Project Structure

```
/
├── frontend/               # React frontend
│   ├── public/             # Static files
│   └── src/
│       ├── components/     # Reusable components
│       ├── contexts/       # React contexts
│       ├── layouts/        # Page layouts
│       ├── pages/          # Page components
│       └── services/       # API services
│
└── backend/                # Express backend
    └── src/
        ├── config/         # Configuration files
        ├── controllers/    # Request handlers
        ├── middleware/     # Express middleware
        ├── models/         # Data models
        └── routes/         # API routes
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Running the Application

```bash
# Start both frontend and backend
npm start

# Start only backend
npm run start:backend

# Start only frontend
npm run start:frontend
```

- Frontend runs at: http://localhost:3000
- Backend API runs at: http://localhost:8000

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login
- `GET /api/users/me` - Get current user

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer (admin only)

### Interactions
- `GET /api/interactions/customer/:customerId` - Get interactions by customer
- `GET /api/interactions/:id` - Get interaction by ID
- `POST /api/interactions` - Create interaction
- `PUT /api/interactions/:id` - Update interaction
- `DELETE /api/interactions/:id` - Delete interaction

## License

MIT