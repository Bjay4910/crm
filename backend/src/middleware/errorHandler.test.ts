import { Request, Response } from 'express';
import { 
  AppError, 
  ErrorTypes, 
  errorHandler, 
  catchAsync, 
  notFoundHandler 
} from './errorHandler';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    nextFunction = jest.fn();
  });

  describe('AppError', () => {
    it('should create an operational error with status code and details', () => {
      const error = new AppError('Test error message', 400, { field: 'test' });
      
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Test error message');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
      expect(error.details).toEqual({ field: 'test' });
    });
  });

  describe('errorHandler middleware', () => {
    it('should handle AppError correctly', () => {
      const error = new AppError('Validation failed', 400, { field: 'name' });
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          type: error.name,
          message: 'Validation failed',
          details: { field: 'name' }
        }
      });
    });
    
    it('should handle validation errors', () => {
      const error = new Error('Validation error');
      error.name = 'ValidationError';
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          type: ErrorTypes.VALIDATION_ERROR,
          message: 'Validation error',
          stack: error.stack
        }
      });
    });
    
    it('should handle JWT errors', () => {
      const error = new Error('Token expired');
      error.name = 'TokenExpiredError';
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          type: ErrorTypes.AUTHENTICATION_ERROR,
          message: 'Invalid or expired token',
          stack: error.stack
        }
      });
    });
    
    it('should handle generic server errors', () => {
      const error = new Error('Unexpected error');
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          type: ErrorTypes.SERVER_ERROR,
          message: error.message,
          stack: error.stack
        }
      });
    });
  });

  describe('catchAsync function', () => {
    it('should catch async errors and pass them to next', async () => {
      const testError = new Error('Async error');
      const asyncFn = jest.fn().mockRejectedValue(testError);
      
      const wrappedFn = catchAsync(asyncFn);
      await wrappedFn(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(asyncFn).toHaveBeenCalled();
      expect(nextFunction).toHaveBeenCalledWith(testError);
    });
  });

  describe('notFoundHandler middleware', () => {
    it('should create a not found error and pass it to next', () => {
      mockRequest.originalUrl = '/not-existing-route';
      
      notFoundHandler(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(nextFunction).toHaveBeenCalled();
      const error = nextFunction.mock.calls[0][0];
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Not Found - /not-existing-route');
      expect(error.name).toBe(ErrorTypes.NOT_FOUND_ERROR);
    });
  });
});