import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/auth';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: string;
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization denied' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({ message: 'Token is not valid' });
      return;
    }

    // Add user info to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ message: 'Authorization denied' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  next();
};