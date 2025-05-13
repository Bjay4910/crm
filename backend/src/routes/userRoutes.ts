import { Router } from 'express';
import { 
  register, 
  login, 
  refreshToken, 
  logout, 
  logoutAllDevices, 
  getCurrentUser, 
  changePassword 
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import cookieParser from 'cookie-parser';

const router = Router();

// Use cookie parser middleware
router.use(cookieParser());

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.post('/logout-all', authenticate, logoutAllDevices);
router.post('/change-password', authenticate, changePassword);

export default router;