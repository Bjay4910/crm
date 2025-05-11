import { Router } from 'express';
import { 
  create, 
  getById, 
  update, 
  remove, 
  getByCustomerId 
} from '../controllers/interactionController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get interaction by ID
router.get('/:id', getById);

// Create new interaction
router.post('/', create);

// Update interaction
router.put('/:id', update);

// Delete interaction
router.delete('/:id', remove);

// Get interactions by customer ID
router.get('/customer/:customerId', getByCustomerId);

export default router;