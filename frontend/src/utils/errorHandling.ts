// Types for API errors
export interface ApiError {
  type: string;
  message: string;
  details?: any;
  stack?: string;
}

export interface ApiErrorResponse {
  success: boolean;
  error: ApiError;
}

// Custom error classes
export class ApiRequestError extends Error {
  status: number;
  data: ApiErrorResponse | null;

  constructor(message: string, status: number, data: ApiErrorResponse | null = null) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.data = data;
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network connection failed. Please check your internet connection.') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class NotFoundError extends Error {
  constructor(resource = 'Resource', message?: string) {
    super(message || `${resource} not found.`);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  fieldErrors: Record<string, string>;
  
  constructor(message = 'Validation failed', fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
  }
}

export class AuthenticationError extends Error {
  constructor(message = 'Authentication failed. Please log in again.') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message = 'You do not have permission to perform this action.') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

// Function to handle errors from API responses
export function handleApiError(error: any): never {
  // Check for network errors
  if (!error.response) {
    throw new NetworkError();
  }

  const { status, data } = error.response;
  
  // Process based on status code
  switch (status) {
    case 400: // Bad Request - typically validation errors
      if (data?.error?.details) {
        throw new ValidationError(data.error.message, data.error.details);
      }
      throw new ApiRequestError(data?.error?.message || 'Invalid request', status, data);
      
    case 401: // Unauthorized
      throw new AuthenticationError(data?.error?.message);
      
    case 403: // Forbidden
      throw new AuthorizationError(data?.error?.message);
      
    case 404: // Not Found
      throw new NotFoundError(undefined, data?.error?.message);
      
    case 500: // Server Error
    case 502: // Bad Gateway
    case 503: // Service Unavailable
    case 504: // Gateway Timeout
      throw new ApiRequestError(
        data?.error?.message || 'Server error. Please try again later.',
        status,
        data
      );
      
    default:
      throw new ApiRequestError(
        data?.error?.message || `Unknown error: ${status}`,
        status,
        data
      );
  }
}

// Function to display user-friendly error messages
export function getUserFriendlyErrorMessage(error: any): string {
  if (error instanceof NetworkError) {
    return 'Network connection failed. Please check your internet connection and try again.';
  }
  
  if (error instanceof NotFoundError) {
    return error.message;
  }
  
  if (error instanceof ValidationError) {
    if (Object.keys(error.fieldErrors).length > 0) {
      // Get the first field error
      const firstField = Object.keys(error.fieldErrors)[0];
      return `${firstField}: ${error.fieldErrors[firstField]}`;
    }
    return 'Please check the form for errors and try again.';
  }
  
  if (error instanceof AuthenticationError) {
    return 'Your session may have expired. Please log in again.';
  }
  
  if (error instanceof AuthorizationError) {
    return 'You do not have permission to perform this action.';
  }
  
  if (error instanceof ApiRequestError) {
    return error.message || 'An error occurred while communicating with the server.';
  }
  
  // For any other error
  return error?.message || 'An unexpected error occurred. Please try again later.';
}

// Helper to extract validation errors for form fields
export function extractValidationErrors(error: any): Record<string, string> {
  if (error instanceof ValidationError) {
    return error.fieldErrors;
  }
  
  if (error?.response?.data?.error?.details) {
    return error.response.data.error.details;
  }
  
  return {};
}