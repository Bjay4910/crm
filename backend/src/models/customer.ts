import { getDatabase } from '../config/database';

export interface Customer {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export async function createCustomer(customer: Customer): Promise<Customer | null> {
  const db = await getDatabase();
  
  try {
    const result = await db.run(
      `INSERT INTO customers (name, email, phone, company, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        customer.name, 
        customer.email || null, 
        customer.phone || null, 
        customer.company || null, 
        customer.status || 'active'
      ]
    );
    
    if (result.lastID) {
      const newCustomer = await db.get<Customer>(
        'SELECT * FROM customers WHERE id = ?',
        result.lastID
      );
      return newCustomer || null;
    }
    return null;
  } catch (error) {
    console.error('Error creating customer:', error);
    return null;
  }
}

export async function updateCustomer(id: number, customer: Partial<Customer>): Promise<boolean> {
  const db = await getDatabase();
  
  // Build the SET part of the query dynamically based on provided fields
  const updates: string[] = [];
  const values: any[] = [];
  
  if (customer.name !== undefined) {
    updates.push('name = ?');
    values.push(customer.name);
  }
  
  if (customer.email !== undefined) {
    updates.push('email = ?');
    values.push(customer.email);
  }
  
  if (customer.phone !== undefined) {
    updates.push('phone = ?');
    values.push(customer.phone);
  }
  
  if (customer.company !== undefined) {
    updates.push('company = ?');
    values.push(customer.company);
  }
  
  if (customer.status !== undefined) {
    updates.push('status = ?');
    values.push(customer.status);
  }
  
  // Add updated_at
  updates.push('updated_at = CURRENT_TIMESTAMP');
  
  // If no updates, return early
  if (updates.length === 0) {
    return false;
  }
  
  try {
    const result = await db.run(
      `UPDATE customers SET ${updates.join(', ')} WHERE id = ?`,
      [...values, id]
    );

    return result.changes !== undefined && result.changes > 0;
  } catch (error) {
    console.error('Error updating customer:', error);
    return false;
  }
}

export async function getCustomerById(id: number): Promise<Customer | null> {
  const db = await getDatabase();
  
  try {
    const customer = await db.get<Customer>(
      'SELECT * FROM customers WHERE id = ?',
      id
    );
    return customer || null;
  } catch (error) {
    console.error('Error getting customer:', error);
    return null;
  }
}

export async function deleteCustomer(id: number): Promise<boolean> {
  const db = await getDatabase();
  
  try {
    // First, delete any interactions for this customer
    await db.run('DELETE FROM interactions WHERE customer_id = ?', id);
    
    // Then delete the customer
    const result = await db.run('DELETE FROM customers WHERE id = ?', id);
    return result.changes !== undefined && result.changes > 0;
  } catch (error) {
    console.error('Error deleting customer:', error);
    return false;
  }
}

export async function getAllCustomers(
  limit: number = 20, 
  offset: number = 0,
  sortBy: string = 'name',
  sortOrder: 'asc' | 'desc' = 'asc',
  filters: Record<string, any> = {}
): Promise<{ customers: Customer[], total: number }> {
  const db = await getDatabase();
  
  try {
    // Build query with filters
    let query = 'SELECT * FROM customers WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM customers WHERE 1=1';
    const queryParams: any[] = [];
    let countQueryParams: any[] = [];
    
    // Add filters
    if (filters.name) {
      query += ' AND name LIKE ?';
      countQuery += ' AND name LIKE ?';
      queryParams.push(`%${filters.name}%`);
      countQueryParams.push(`%${filters.name}%`);
    }

    if (filters.email) {
      query += ' AND email LIKE ?';
      countQuery += ' AND email LIKE ?';
      queryParams.push(`%${filters.email}%`);
      countQueryParams.push(`%${filters.email}%`);
    }

    if (filters.company) {
      query += ' AND company LIKE ?';
      countQuery += ' AND company LIKE ?';
      queryParams.push(`%${filters.company}%`);
      countQueryParams.push(`%${filters.company}%`);
    }

    if (filters.status) {
      query += ' AND status = ?';
      countQuery += ' AND status = ?';
      queryParams.push(filters.status);
      countQueryParams.push(filters.status);
    }
    
    // Add sorting
    const validSortFields = ['name', 'email', 'company', 'status', 'created_at'];
    const actualSortBy = validSortFields.includes(sortBy) ? sortBy : 'name';
    const actualSortOrder = sortOrder === 'desc' ? 'DESC' : 'ASC';
    
    query += ` ORDER BY ${actualSortBy} ${actualSortOrder}`;
    
    // Add pagination
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);
    
    // Get customers and total count
    const customers = await db.all<Customer[]>(query, queryParams);
    const countResult = await db.get<{ total: number }>(countQuery, countQueryParams);
    
    return {
      customers,
      total: countResult?.total || 0
    };
  } catch (error) {
    console.error('Error getting customers:', error);
    return { customers: [], total: 0 };
  }
}