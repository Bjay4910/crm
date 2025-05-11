import { Router } from 'express';
import { 
  create, 
  update, 
  getById, 
  remove, 
  getAll 
} from '../controllers/customerController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all customers
router.get('/', getAll);

// Get customer by ID
router.get('/:id', getById);

// Create new customer
router.post('/', create);

// Update customer
router.put('/:id', update);

// Delete customer (admin only)
router.delete('/:id', isAdmin, remove);

export default router;