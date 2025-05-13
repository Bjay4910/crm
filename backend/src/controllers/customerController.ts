import { Request, Response, NextFunction } from 'express';
import { 
  createCustomer, 
  updateCustomer, 
  getCustomerById, 
  deleteCustomer, 
  getAllCustomers 
} from '../models/customer';
import { AppError, ErrorTypes, catchAsync } from '../middleware/errorHandler';

export const create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, phone, company, status } = req.body;

  // Validate required fields
  if (!name) {
    throw new AppError('Name is required', 400, { field: 'name' });
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
    throw new AppError('Error creating customer', 500);
  }

  res.status(201).json({
    success: true,
    data: customer
  });
});

export const update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  const { name, email, phone, company, status } = req.body;

  // Check if customer exists
  const existingCustomer = await getCustomerById(id);
  if (!existingCustomer) {
    throw new AppError(`Customer with ID ${id} not found`, 404);
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
    throw new AppError('Error updating customer', 500);
  }

  // Get updated customer
  const updatedCustomer = await getCustomerById(id);
  
  res.json({
    success: true,
    data: updatedCustomer
  });
});

export const getById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  
  const customer = await getCustomerById(id);
  if (!customer) {
    throw new AppError(`Customer with ID ${id} not found`, 404);
  }

  res.json({
    success: true,
    data: customer
  });
});

export const remove = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);

  // Check if customer exists
  const existingCustomer = await getCustomerById(id);
  if (!existingCustomer) {
    throw new AppError(`Customer with ID ${id} not found`, 404);
  }

  // Delete customer
  const success = await deleteCustomer(id);
  if (!success) {
    throw new AppError('Error deleting customer', 500);
  }

  res.json({
    success: true,
    message: 'Customer deleted successfully'
  });
});

export const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
    success: true,
    data: {
      customers: result.customers,
      total: result.total,
      limit,
      offset
    }
  });
});