import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Register new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get current user
router.get('/me', authenticate, getCurrentUser);

export default router;