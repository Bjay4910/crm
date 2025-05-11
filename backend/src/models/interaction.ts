import { getDatabase } from '../config/database';

export interface Interaction {
  id?: number;
  customer_id: number;
  user_id: number;
  type: string;
  description: string;
  date?: string;
  created_at?: string;
  updated_at?: string;
}

export async function createInteraction(interaction: Interaction): Promise<Interaction | null> {
  const db = await getDatabase();
  
  try {
    const result = await db.run(
      `INSERT INTO interactions (customer_id, user_id, type, description, date) 
       VALUES (?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))`,
      [
        interaction.customer_id,
        interaction.user_id,
        interaction.type,
        interaction.description,
        interaction.date
      ]
    );
    
    if (result.lastID) {
      const newInteraction = await db.get<Interaction>(
        'SELECT * FROM interactions WHERE id = ?',
        result.lastID
      );
      return newInteraction || null;
    }
    return null;
  } catch (error) {
    console.error('Error creating interaction:', error);
    return null;
  }
}

export async function getInteractionById(id: number): Promise<Interaction | null> {
  const db = await getDatabase();
  
  try {
    const interaction = await db.get<Interaction>(
      'SELECT * FROM interactions WHERE id = ?',
      id
    );
    return interaction || null;
  } catch (error) {
    console.error('Error getting interaction:', error);
    return null;
  }
}

export async function updateInteraction(id: number, interaction: Partial<Interaction>): Promise<boolean> {
  const db = await getDatabase();
  
  // Build the SET part of the query dynamically based on provided fields
  const updates: string[] = [];
  const values: any[] = [];
  
  if (interaction.type !== undefined) {
    updates.push('type = ?');
    values.push(interaction.type);
  }
  
  if (interaction.description !== undefined) {
    updates.push('description = ?');
    values.push(interaction.description);
  }
  
  if (interaction.date !== undefined) {
    updates.push('date = ?');
    values.push(interaction.date);
  }
  
  // Add updated_at
  updates.push('updated_at = CURRENT_TIMESTAMP');
  
  // If no updates, return early
  if (updates.length === 0) {
    return false;
  }
  
  try {
    const result = await db.run(
      `UPDATE interactions SET ${updates.join(', ')} WHERE id = ?`,
      [...values, id]
    );
    
    return result.changes > 0;
  } catch (error) {
    console.error('Error updating interaction:', error);
    return false;
  }
}

export async function deleteInteraction(id: number): Promise<boolean> {
  const db = await getDatabase();
  
  try {
    const result = await db.run('DELETE FROM interactions WHERE id = ?', id);
    return result.changes > 0;
  } catch (error) {
    console.error('Error deleting interaction:', error);
    return false;
  }
}

export async function getInteractionsByCustomerId(
  customerId: number, 
  limit: number = 20, 
  offset: number = 0
): Promise<{ interactions: Interaction[], total: number }> {
  const db = await getDatabase();
  
  try {
    const interactions = await db.all<Interaction[]>(
      `SELECT i.*, u.username as user_name
       FROM interactions i
       LEFT JOIN users u ON i.user_id = u.id
       WHERE i.customer_id = ?
       ORDER BY i.date DESC
       LIMIT ? OFFSET ?`,
      [customerId, limit, offset]
    );
    
    const countResult = await db.get<{ total: number }>(
      'SELECT COUNT(*) as total FROM interactions WHERE customer_id = ?',
      customerId
    );
    
    return {
      interactions,
      total: countResult?.total || 0
    };
  } catch (error) {
    console.error('Error getting interactions by customer ID:', error);
    return { interactions: [], total: 0 };
  }
}