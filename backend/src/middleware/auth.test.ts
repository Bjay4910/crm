import { Request, Response } from 'express';
import { 
  authenticate, 
  requireRole, 
  isAdmin, 
  isResourceOwner 
} from './auth';
import * as authConfig from '../config/auth';

// Mock the auth config module
jest.mock('../config/auth', () => ({
  verifyAccessToken: jest.fn()
}));

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      user: undefined
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    nextFunction = jest.fn();
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('authenticate middleware', () => {
    it('should call next if authentication is successful', async () => {
      // Setup mock request with auth header
      mockRequest.headers = {
        authorization: 'Bearer valid-token'
      };
      
      // Setup mock auth verification
      const mockUserData = { userId: 1, role: 'user', type: 'access' };
      (authConfig.verifyAccessToken as jest.Mock).mockReturnValue(mockUserData);
      
      // Call the middleware
      await authenticate(mockRequest as Request, mockResponse as Response, nextFunction);
      
      // Assertions
      expect(authConfig.verifyAccessToken).toHaveBeenCalledWith('valid-token');
      expect(mockRequest.user).toEqual({
        userId: 1,
        role: 'user'
      });
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
    
    it('should throw an error if no auth header is present', async () => {
      // Call the middleware
      await expect(authenticate(
        mockRequest as Request, 
        mockResponse as Response, 
        nextFunction
      )).rejects.toThrow('No token provided, authorization denied');
      
      // Assertions
      expect(authConfig.verifyAccessToken).not.toHaveBeenCalled();
      expect(nextFunction).not.toHaveBeenCalled();
    });
    
    it('should throw an error if auth header format is invalid', async () => {
      // Setup mock request with invalid auth header
      mockRequest.headers = {
        authorization: 'InvalidFormat'
      };
      
      // Call the middleware
      await expect(authenticate(
        mockRequest as Request, 
        mockResponse as Response, 
        nextFunction
      )).rejects.toThrow('No token provided, authorization denied');
      
      // Assertions
      expect(authConfig.verifyAccessToken).not.toHaveBeenCalled();
      expect(nextFunction).not.toHaveBeenCalled();
    });
    
    it('should pass through token verification errors', async () => {
      // Setup mock request with auth header
      mockRequest.headers = {
        authorization: 'Bearer invalid-token'
      };
      
      // Setup mock auth verification to throw
      const testError = new Error('Token verification failed');
      (authConfig.verifyAccessToken as jest.Mock).mockImplementation(() => {
        throw testError;
      });
      
      // Call the middleware
      await expect(authenticate(
        mockRequest as Request, 
        mockResponse as Response, 
        nextFunction
      )).rejects.toThrow('Token verification failed');
      
      // Assertions
      expect(authConfig.verifyAccessToken).toHaveBeenCalled();
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('requireRole middleware', () => {
    beforeEach(() => {
      // Setup authenticated request
      mockRequest.user = {
        userId: 1,
        role: 'user'
      };
    });
    
    it('should call next if user has the required role', async () => {
      // Create middleware requiring 'user' role
      const middleware = requireRole('user');
      
      // Call the middleware
      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);
      
      // Assertions
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
    
    it('should throw if user is not authenticated', async () => {
      // Clear user
      mockRequest.user = undefined;
      
      // Create middleware requiring 'user' role
      const middleware = requireRole('user');
      
      // Call the middleware
      await expect(middleware(
        mockRequest as Request, 
        mockResponse as Response, 
        nextFunction
      )).rejects.toThrow('Not authenticated');
      
      // Assertions
      expect(nextFunction).not.toHaveBeenCalled();
    });
    
    it('should throw if user does not have the required role', async () => {
      // Create middleware requiring 'admin' role
      const middleware = requireRole('admin');
      
      // Call the middleware
      await expect(middleware(
        mockRequest as Request, 
        mockResponse as Response, 
        nextFunction
      )).rejects.toThrow('Requires admin role');
      
      // Assertions
      expect(nextFunction).not.toHaveBeenCalled();
    });
    
    it('should handle multiple allowed roles', async () => {
      // Create middleware allowing 'user' or 'admin'
      const middleware = requireRole(['user', 'admin']);
      
      // Call the middleware
      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);
      
      // Assertions
      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('isResourceOwner middleware', () => {
    beforeEach(() => {
      // Setup authenticated request with user role
      mockRequest.user = {
        userId: 1,
        role: 'user'
      };
    });
    
    it('should call next if user is the resource owner', async () => {
      // Create extract function that returns the same ID as the user
      const extractUserId = () => 1;
      const middleware = isResourceOwner(extractUserId);
      
      // Call the middleware
      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);
      
      // Assertions
      expect(nextFunction).toHaveBeenCalled();
    });
    
    it('should call next if user is admin', async () => {
      // Setup user as admin
      mockRequest.user = {
        userId: 999,
        role: 'admin'
      };
      
      // Create extract function that returns different ID from the user
      const extractUserId = () => 1;
      const middleware = isResourceOwner(extractUserId);
      
      // Call the middleware
      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);
      
      // Assertions
      expect(nextFunction).toHaveBeenCalled();
    });
    
    it('should throw if user is not authenticated', async () => {
      // Clear user
      mockRequest.user = undefined;
      
      // Create middleware
      const extractUserId = () => 1;
      const middleware = isResourceOwner(extractUserId);
      
      // Call the middleware
      await expect(middleware(
        mockRequest as Request, 
        mockResponse as Response, 
        nextFunction
      )).rejects.toThrow('Not authenticated');
      
      // Assertions
      expect(nextFunction).not.toHaveBeenCalled();
    });
    
    it('should throw if user is not the owner and not admin', async () => {
      // Create extract function that returns different ID from the user
      const extractUserId = () => 2;
      const middleware = isResourceOwner(extractUserId);
      
      // Call the middleware
      await expect(middleware(
        mockRequest as Request, 
        mockResponse as Response, 
        nextFunction
      )).rejects.toThrow('Not authorized to access this resource');
      
      // Assertions
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });
});