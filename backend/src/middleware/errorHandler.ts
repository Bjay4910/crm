import { Request, Response, NextFunction } from 'express';

// Custom error class that includes status code and additional details
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Indicates if this is an operational error we can handle
    this.details = details;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

// Different error types to standardize error handling
export const ErrorTypes = {
  VALIDATION_ERROR: 'ValidationError',
  AUTHENTICATION_ERROR: 'AuthenticationError',
  AUTHORIZATION_ERROR: 'AuthorizationError',
  NOT_FOUND_ERROR: 'NotFoundError',
  CONFLICT_ERROR: 'ConflictError',
  DATABASE_ERROR: 'DatabaseError',
  SERVER_ERROR: 'ServerError',
  NETWORK_ERROR: 'NetworkError'
};

// Error handler middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error for debugging
  console.error(`[ERROR] ${err.message}`);
  console.error(err.stack);

  // If it's our AppError, we know how to handle it
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        type: err.name,
        message: err.message,
        ...(err.details && { details: err.details }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      }
    });
  }

  // Handle Mongoose/MongoDB validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        type: ErrorTypes.VALIDATION_ERROR,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      }
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        type: ErrorTypes.AUTHENTICATION_ERROR,
        message: 'Invalid or expired token',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      }
    });
  }

  // For any other error, return a generic server error
  return res.status(500).json({
    success: false,
    error: {
      type: ErrorTypes.SERVER_ERROR,
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

// Async error handler wrapper to avoid try-catch blocks
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

// Not found error handler middleware
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  error.name = ErrorTypes.NOT_FOUND_ERROR;
  next(error);
};