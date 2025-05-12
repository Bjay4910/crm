import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './config/database';
import userRoutes from './routes/userRoutes';
import customerRoutes from './routes/customerRoutes';
import interactionRoutes from './routes/interactionRoutes';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 8000; // Changed from 5000 to 8000

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/interactions', interactionRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Initialize database and start server
async function startServer() {
  try {
    // Initialize the database
    await initializeDatabase();
    console.log('Database initialized');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();