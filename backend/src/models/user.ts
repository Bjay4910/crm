import { getDatabase } from '../config/database';
import bcrypt from 'bcrypt';

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export async function createUser(user: User): Promise<UserResponse | null> {
  const db = await getDatabase();
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  
  try {
    const result = await db.run(
      `INSERT INTO users (username, email, password, role) 
       VALUES (?, ?, ?, ?)`,
      [user.username, user.email, hashedPassword, user.role || 'user']
    );
    
    if (result.lastID) {
      const newUser = await db.get<UserResponse>(
        'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
        result.lastID
      );
      return newUser || null;
    }
    return null;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = await getDatabase();
  try {
    const user = await db.get<User>('SELECT * FROM users WHERE email = ?', email);
    return user || null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

export async function findUserById(id: number): Promise<UserResponse | null> {
  const db = await getDatabase();
  try {
    const user = await db.get<UserResponse>(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      id
    );
    return user || null;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    return null;
  }
}

export async function validatePassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.password);
}