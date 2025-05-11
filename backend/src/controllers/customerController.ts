import { Request, Response } from 'express';
import { 
  createCustomer, 
  updateCustomer, 
  getCustomerById, 
  deleteCustomer, 
  getAllCustomers 
} from '../models/customer';

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, company, status } = req.body;

    // Validate required fields
    if (!name) {
      res.status(400).json({ message: 'Name is required' });
      return;
    }

    // Create customer
    const customer = await createCustomer({
      name,
      email,
      phone,
      company,
      status
    });

    if (!customer) {
      res.status(500).json({ message: 'Error creating customer' });
      return;
    }

    res.status(201).json(customer);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { name, email, phone, company, status } = req.body;

    // Check if customer exists
    const existingCustomer = await getCustomerById(id);
    if (!existingCustomer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    // Update customer
    const success = await updateCustomer(id, {
      name,
      email,
      phone,
      company,
      status
    });

    if (!success) {
      res.status(500).json({ message: 'Error updating customer' });
      return;
    }

    // Get updated customer
    const updatedCustomer = await getCustomerById(id);
    res.json(updatedCustomer);
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    const customer = await getCustomerById(id);
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    res.json(customer);
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    // Check if customer exists
    const existingCustomer = await getCustomerById(id);
    if (!existingCustomer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    // Delete customer
    const success = await deleteCustomer(id);
    if (!success) {
      res.status(500).json({ message: 'Error deleting customer' });
      return;
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    // Parse query parameters
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    const sortBy = req.query.sortBy as string || 'name';
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'asc';
    
    // Extract filters
    const filters: Record<string, any> = {};
    if (req.query.name) filters.name = req.query.name;
    if (req.query.email) filters.email = req.query.email;
    if (req.query.company) filters.company = req.query.company;
    if (req.query.status) filters.status = req.query.status;
    
    const result = await getAllCustomers(limit, offset, sortBy, sortOrder, filters);
    
    res.json({
      customers: result.customers,
      total: result.total,
      limit,
      offset
    });
  } catch (error) {
    console.error('Get all customers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};