import express from 'express';
import cors from 'cors';
import path from 'path';
import compression from 'compression';
import expressStaticGzip from 'express-static-gzip';
import swaggerUi from 'swagger-ui-express';
import { initializeDatabase } from './config/database';
import userRoutes from './routes/userRoutes';
import customerRoutes from './routes/customerRoutes';
import interactionRoutes from './routes/interactionRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import swaggerSpec from './config/swagger';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 8000; // Changed from 5000 to 8000

// Middleware
app.use(cors());
app.use(express.json());
app.use(compression());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/interactions', interactionRoutes);

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve the root landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
});

// Simple redirect for frontend
app.get('/app', (req, res) => {
  res.redirect('http://localhost:3001');
});

// Simple wildcard redirect for all app/* routes
app.get('/app/*', (req, res) => {
  const targetPath = req.originalUrl.replace(/^\/app\//, '') || '/';
  res.redirect(`http://localhost:3001/${targetPath}`);
});

// Error handling middleware - must be added after all routes
app.use(notFoundHandler); // Handle 404 errors
app.use(errorHandler);   // Handle all other errors

// Initialize database and start server
async function startServer() {
  try {
    // Initialize the database
    await initializeDatabase();
    console.log('Database initialized');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Access the application at: http://localhost:${PORT}`);
      console.log(`Frontend available at: http://localhost:${PORT}/app`);
      console.log(`API available at: http://localhost:${PORT}/api`);
      console.log(`API documentation available at: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();