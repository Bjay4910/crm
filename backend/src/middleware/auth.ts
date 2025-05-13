import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../config/auth';
import { AppError, catchAsync } from './errorHandler';

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

// Authenticate middleware using our error handling system
export const authenticate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('No token provided, authorization denied', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify access token
    const decoded = verifyAccessToken(token);

    // Add user info to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (err) {
    // AppError from verifyAccessToken will be caught by our error handler
    throw err;
  }
});

// Role-based access control middleware
export const requireRole = (roles: string | string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(`Requires ${allowedRoles.join(' or ')} role`, 403);
    }

    next();
  });
};

// Shorthand middleware for common roles
export const isAdmin = requireRole('admin');
export const isManager = requireRole('manager');
export const isUser = requireRole('user');

// Combined middleware for either admin or manager
export const isAdminOrManager = requireRole(['admin', 'manager']);

// Resource ownership check middleware
export const isResourceOwner = (extractUserId: (req: Request) => number) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const resourceUserId = extractUserId(req);
    
    // Allow if user is the owner or an admin
    if (req.user.userId === resourceUserId || req.user.role === 'admin') {
      return next();
    }
    
    throw new AppError('Not authorized to access this resource', 403);
  });
};