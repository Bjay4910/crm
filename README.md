# CRM System Prototype

A full-featured Customer Relationship Management (CRM) system with a React frontend and Express backend.

## Features

- Enhanced security with JWT access and refresh tokens
- Customer management with filters and sorting
- Interaction tracking and history
- Interactive dashboard with key metrics and data visualizations
- Personalized time-based greetings (morning/afternoon/evening)
- Quick action buttons for common tasks
- Notification center with priority indicators
- Global search functionality
- Sleek animations and transitions throughout the interface
- Role-based access control
- Dark/light mode with system preference detection
- Full keyboard navigation support
- Mobile-responsive design
- Comprehensive API documentation
- Extensive error handling and validation

## Tech Stack

### Frontend
- React with TypeScript
- Material UI components with theme customization
- React Router for navigation
- React Query for state management and data fetching
- Recharts for interactive data visualizations
- Vitest for unit testing
- Context API for global state
- Accessibility-focused design with ARIA attributes
- Custom animation effects using CSS transitions

### Backend
- Express.js with TypeScript
- SQLite database for data persistence
- JWT authentication with refresh token rotation
- OpenAPI/Swagger for API documentation
- Jest for unit testing
- Error handling middleware

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

## UI Enhancements

The latest update includes significant UI improvements:

- **Data Visualizations**: Interactive pie chart showing customer distribution and bar graph displaying leads by source
- **Personalized Greeting**: Dynamic greeting that changes based on the time of day
- **Quick-Actions Section**: Convenient buttons for frequently used operations
- **Notification Center**: Alerts for urgent tasks with visual indicators
- **Global Search**: Easily find customers, interactions, or leads from anywhere
- **Smooth Animations**: Gentle fade-ins, hover effects, and transitions between sections
- **Custom Branding**: Updated navigation icons and personalized avatar
- **Responsive Cards**: Interactive elements with hover and focus effects

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

- Frontend runs at: http://localhost:3001
- Backend API runs at: http://localhost:8000
- API Documentation runs at: http://localhost:8000/api-docs

### Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login with credentials
- `POST /api/users/refresh` - Refresh access token
- `POST /api/users/logout` - Logout current device
- `GET /api/users/me` - Get current user profile
- `POST /api/users/logout-all` - Logout from all devices
- `POST /api/users/change-password` - Change user password

### Customers
- `GET /api/customers` - Get all customers (with pagination, sorting, and filtering)
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

## Keyboard Shortcuts

The application supports keyboard navigation for power users:
- `Alt + H` - Navigate to Home
- `Alt + D` - Navigate to Dashboard
- `Alt + C` - Navigate to Customers
- `Alt + N` - Add New Customer
- `/` - Focus Search
- `Shift + ?` - Open Keyboard Shortcuts Help Dialog
- `Esc` - Close modal or dialogue

## Accessibility Features

- Dark/light mode with system preference detection
- Skip to content link for keyboard users
- ARIA labels and roles throughout the application
- Enhanced focus styles for keyboard navigation
- Responsive design for all screen sizes
- Screen reader compatible components

## Deployment

This application can be deployed in various ways:

- **GitHub Pages**: For static frontend deployment
- **Heroku**: For full-stack deployment
- **Vercel**: For frontend-only deployment
- **AWS/GCP/Azure**: For production-grade deployment

## License

MIT