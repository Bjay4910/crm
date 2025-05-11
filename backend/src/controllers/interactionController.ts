import { Request, Response } from 'express';
import { 
  createInteraction, 
  getInteractionById, 
  updateInteraction, 
  deleteInteraction, 
  getInteractionsByCustomerId 
} from '../models/interaction';
import { getCustomerById } from '../models/customer';

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { customer_id, type, description, date } = req.body;

    // Validate required fields
    if (!customer_id || !type || !description) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Check if customer exists
    const customer = await getCustomerById(customer_id);
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    // Create interaction
    const interaction = await createInteraction({
      customer_id,
      user_id: req.user.userId,
      type,
      description,
      date
    });

    if (!interaction) {
      res.status(500).json({ message: 'Error creating interaction' });
      return;
    }

    res.status(201).json(interaction);
  } catch (error) {
    console.error('Create interaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    const interaction = await getInteractionById(id);
    if (!interaction) {
      res.status(404).json({ message: 'Interaction not found' });
      return;
    }

    res.json(interaction);
  } catch (error) {
    console.error('Get interaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const id = parseInt(req.params.id);
    const { type, description, date } = req.body;

    // Check if interaction exists
    const existingInteraction = await getInteractionById(id);
    if (!existingInteraction) {
      res.status(404).json({ message: 'Interaction not found' });
      return;
    }

    // Verify ownership or admin status
    if (existingInteraction.user_id !== req.user.userId && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to update this interaction' });
      return;
    }

    // Update interaction
    const success = await updateInteraction(id, {
      type,
      description,
      date
    });

    if (!success) {
      res.status(500).json({ message: 'Error updating interaction' });
      return;
    }

    // Get updated interaction
    const updatedInteraction = await getInteractionById(id);
    res.json(updatedInteraction);
  } catch (error) {
    console.error('Update interaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const id = parseInt(req.params.id);
    
    // Check if interaction exists
    const existingInteraction = await getInteractionById(id);
    if (!existingInteraction) {
      res.status(404).json({ message: 'Interaction not found' });
      return;
    }

    // Verify ownership or admin status
    if (existingInteraction.user_id !== req.user.userId && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to delete this interaction' });
      return;
    }

    // Delete interaction
    const success = await deleteInteraction(id);
    if (!success) {
      res.status(500).json({ message: 'Error deleting interaction' });
      return;
    }

    res.json({ message: 'Interaction deleted successfully' });
  } catch (error) {
    console.error('Delete interaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getByCustomerId = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = parseInt(req.params.customerId);
    
    // Check if customer exists
    const customer = await getCustomerById(customerId);
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }
    
    // Parse query parameters
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    
    const result = await getInteractionsByCustomerId(customerId, limit, offset);
    
    res.json({
      interactions: result.interactions,
      total: result.total,
      limit,
      offset
    });
  } catch (error) {
    console.error('Get interactions by customer ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};