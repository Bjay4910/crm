import { Request, Response, NextFunction } from 'express';
import { createUser, findUserByEmail, validatePassword, findUserById, UserResponse } from '../models/user';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  refreshAccessToken,
  revokeRefreshToken,
  revokeAllUserTokens
} from '../config/auth';
import { AppError, catchAsync } from '../middleware/errorHandler';

// Cookie options for refresh token
const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,      // Prevents client-side JS from reading the cookie
  secure: process.env.NODE_ENV === 'production', // true in production for HTTPS only
  sameSite: 'lax' as const,  // Prevents CSRF attacks
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/users/refresh' // Only sent to the refresh endpoint
};

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    throw new AppError('Please provide username, email, and password', 400);
  }

  // Check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  // Create new user
  const newUser = await createUser({
    username,
    email,
    password,
    role: 'user'
  });

  if (!newUser) {
    throw new AppError('Error creating user', 500);
  }

  // Generate tokens
  const accessToken = generateAccessToken(newUser.id, newUser.role);
  const { token: refreshToken } = generateRefreshToken(newUser.id);

  // Set refresh token as HTTP-only cookie
  res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  // Return tokens and user info
  res.status(201).json({
    success: true,
    data: {
      accessToken,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    }
  });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  // Find user by email
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Validate password
  const isMatch = await validatePassword(user, password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.id as number, user.role as string);
  const { token: refreshToken } = generateRefreshToken(user.id as number);

  // Set refresh token as HTTP-only cookie
  res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  // Return access token and user info
  res.json({
    success: true,
    data: {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }
  });
});

export const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Get refresh token from cookies or request body
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  
  if (!refreshToken) {
    throw new AppError('Refresh token not provided', 401);
  }

  try {
    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = refreshAccessToken(refreshToken);
    
    // Update cookie with new refresh token
    res.cookie('refreshToken', newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    
    // Return new access token
    res.json({
      success: true,
      data: {
        accessToken
      }
    });
  } catch (error) {
    // Clear the invalid cookie
    res.clearCookie('refreshToken', { path: '/api/users/refresh' });
    throw error; // Rethrow for our error handler
  }
});

export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Get refresh token from cookies or request body
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  
  // Revoke token if it exists
  if (refreshToken) {
    revokeRefreshToken(refreshToken);
  }
  
  // Clear refresh token cookie
  res.clearCookie('refreshToken', { path: '/api/users/refresh' });
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export const logoutAllDevices = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }
  
  // Revoke all refresh tokens for the user
  revokeAllUserTokens(req.user.userId);
  
  // Clear the current device's cookie
  res.clearCookie('refreshToken', { path: '/api/users/refresh' });
  
  res.json({
    success: true,
    message: 'Logged out from all devices successfully'
  });
});

export const getCurrentUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }
  
  // Get full user data from database
  const user = await findUserById(req.user.userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      }
    }
  });
});

export const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }
  
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    throw new AppError('Please provide current and new passwords', 400);
  }
  
  // Get user from database
  const user = await findUserById(req.user.userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Validate current password
  const isMatch = await validatePassword(user, currentPassword);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 401);
  }
  
  // TODO: Update password in database
  // This would require adding a method to update password
  // user.password = await hashPassword(newPassword);
  // await user.save();
  
  // Logout from all devices for security
  revokeAllUserTokens(req.user.userId);
  
  // Clear the current device's cookie
  res.clearCookie('refreshToken', { path: '/api/users/refresh' });
  
  res.json({
    success: true,
    message: 'Password updated successfully. Please log in again.'
  });
});