import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AppError } from '../middleware/errorHandler';

// In production, use environment variables for all these settings
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'your-access-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '15m'; // Short-lived access token
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d'; // Longer-lived refresh token

// Store for refresh tokens (in a real app, this would be in a database)
// In production, use Redis or another persistent store instead of in-memory
const refreshTokens: Record<string, { userId: number; tokenFamily: string }> = {};

// Generate a random token family id to handle token rotation
const generateTokenFamily = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

// Generate access token
export const generateAccessToken = (userId: number, role: string): string => {
  return jwt.sign(
    { userId, role, type: 'access' },
    JWT_ACCESS_SECRET,
    { expiresIn: JWT_ACCESS_EXPIRATION }
  );
};

// Generate refresh token with a token family
export const generateRefreshToken = (userId: number, tokenFamily?: string): { token: string, tokenFamily: string } => {
  // Create a token family or use an existing one (for token rotation)
  const family = tokenFamily || generateTokenFamily();
  
  const token = jwt.sign(
    { userId, type: 'refresh', family },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRATION }
  );
  
  // Store refresh token info
  refreshTokens[token] = { userId, tokenFamily: family };
  
  return { token, tokenFamily: family };
};

// Check if a token is valid
export const verifyAccessToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    
    // Check if it's an access token
    if (decoded && typeof decoded === 'object' && decoded.type !== 'access') {
      throw new AppError('Invalid token type', 401);
    }
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Access token expired', 401);
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid token', 401);
    }
    throw error;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as jwt.JwtPayload;
    
    // Check if it's a refresh token
    if (decoded && typeof decoded === 'object' && decoded.type !== 'refresh') {
      throw new AppError('Invalid token type', 401);
    }
    
    // Check if token exists in our store
    if (!refreshTokens[token]) {
      throw new AppError('Invalid refresh token', 401);
    }
    
    // Check token family for token rotation
    if (decoded.family !== refreshTokens[token].tokenFamily) {
      throw new AppError('Token family mismatch', 401);
    }
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // Remove expired token from store
      if (refreshTokens[token]) {
        delete refreshTokens[token];
      }
      throw new AppError('Refresh token expired', 401);
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid token', 401);
    }
    throw error;
  }
};

// Generate a new access token from a refresh token
export const refreshAccessToken = (refreshToken: string): { accessToken: string, refreshToken: string } => {
  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);
  
  // Token valid, get user data
  const { userId } = refreshTokens[refreshToken];
  
  // Remove the old refresh token to prevent reuse
  const tokenFamily = refreshTokens[refreshToken].tokenFamily;
  delete refreshTokens[refreshToken];
  
  // Create new tokens - rotate refresh token
  const accessToken = generateAccessToken(userId, 'user'); // Would get actual role from db
  const { token: newRefreshToken } = generateRefreshToken(userId, tokenFamily);
  
  return { accessToken, refreshToken: newRefreshToken };
};

// Revoke a refresh token (e.g. at logout)
export const revokeRefreshToken = (token: string): boolean => {
  if (refreshTokens[token]) {
    delete refreshTokens[token];
    return true;
  }
  return false;
};

// Revoke all refresh tokens for a user (e.g. force logout all devices)
export const revokeAllUserTokens = (userId: number): void => {
  for (const token in refreshTokens) {
    if (refreshTokens[token].userId === userId) {
      delete refreshTokens[token];
    }
  }
};