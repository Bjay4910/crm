import { Request, Response } from 'express';
import { 
  createInteraction, 
  getInteractionById, 
  updateInteraction, 
  deleteInteraction, 
  getInteractionsByCustomerId 
} from '../models/interaction';
import { getCustomerById } from '../models/customer';

export const create = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { customer_id, type, description, date } = req.body;

    // Validate required fields
    if (!customer_id || !type || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if customer exists
    const customer = await getCustomerById(customer_id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
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
      return res.status(500).json({ message: 'Error creating interaction' });
    }

    res.status(201).json(interaction);
  } catch (error) {
    console.error('Create interaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    const interaction = await getInteractionById(id);
    if (!interaction) {
      return res.status(404).json({ message: 'Interaction not found' });
    }

    res.json(interaction);
  } catch (error) {
    console.error('Get interaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const id = parseInt(req.params.id);
    const { type, description, date } = req.body;

    // Check if interaction exists
    const existingInteraction = await getInteractionById(id);
    if (!existingInteraction) {
      return res.status(404).json({ message: 'Interaction not found' });
    }

    // Verify ownership or admin status
    if (existingInteraction.user_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this interaction' });
    }

    // Update interaction
    const success = await updateInteraction(id, {
      type,
      description,
      date
    });

    if (!success) {
      return res.status(500).json({ message: 'Error updating interaction' });
    }

    // Get updated interaction
    const updatedInteraction = await getInteractionById(id);
    res.json(updatedInteraction);
  } catch (error) {
    console.error('Update interaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const id = parseInt(req.params.id);
    
    // Check if interaction exists
    const existingInteraction = await getInteractionById(id);
    if (!existingInteraction) {
      return res.status(404).json({ message: 'Interaction not found' });
    }

    // Verify ownership or admin status
    if (existingInteraction.user_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this interaction' });
    }

    // Delete interaction
    const success = await deleteInteraction(id);
    if (!success) {
      return res.status(500).json({ message: 'Error deleting interaction' });
    }

    res.json({ message: 'Interaction deleted successfully' });
  } catch (error) {
    console.error('Delete interaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getByCustomerId = async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.customerId);
    
    // Check if customer exists
    const customer = await getCustomerById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
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