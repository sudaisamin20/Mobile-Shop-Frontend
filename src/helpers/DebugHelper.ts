// Debug and API Response Helpers
// Utility functions for debugging and validating API responses

/**
 * Log API response for debugging
 */
export const logAPIResponse = (endpoint: string, response: any, context?: string) => {
  if (import.meta.env.DEV) {
    console.group(`🔗 API Response: ${endpoint}${context ? ` (${context})` : ''}`);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    console.groupEnd();
  }
};

/**
 * Log Redux action for debugging
 */
export const logReduxAction = (actionName: string, payload: any, status: 'pending' | 'fulfilled' | 'rejected') => {
  if (import.meta.env.DEV) {
    const colors = {
      pending: '⏳',
      fulfilled: '✅',
      rejected: '❌'
    };
    console.log(`${colors[status]} Redux: ${actionName} [${status}]`, payload);
  }
};

/**
 * Validate auth response from backend
 */
export const validateAuthResponse = (data: any): { valid: boolean; error?: string } => {
  if (!data) {
    return { valid: false, error: 'No data received' };
  }

  if (!data.user) {
    return { valid: false, error: 'User data missing from response' };
  }

  if (!data.token) {
    return { valid: false, error: 'Token missing from response' };
  }

  if (!data.user.id || !data.user.email || !data.user.role) {
    return { valid: false, error: 'User data incomplete' };
  }

  return { valid: true };
};

/**
 * Format user data for display
 */
export const formatUserDisplay = (user: any) => {
  return {
    name: user.name || 'Unknown User',
    email: user.email || '',
    role: user.role || 'USER',
    avatar: user.avatar || '',
  };
};

/**
 * Check if user is admin
 */
export const isAdmin = (user: any): boolean => {
  return user?.role === 'ADMIN' || user?.role === 'admin';
};

/**
 * Check if user is authenticated
 */
export const isUserAuthenticated = (user: any, token?: string): boolean => {
  return !!(user?.id && user?.email && (token || localStorage.getItem('auth_token')));
};

/**
 * Safe user role check
 */
export const checkUserRole = (user: any, requiredRole: string): boolean => {
  if (!user || !user.role) return false;
  return user.role.toUpperCase() === requiredRole.toUpperCase();
};
