// Protected Route Component
// Redirects unauthenticated users to login

import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/index';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'ADMIN' | 'USER';
}

export const ProtectedRoute = ({
  children,
  requiredRole,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);

  console.log('🔐 ProtectedRoute Check:', {
    isAuthenticated,
    user,
    userRole: user?.role,
    requiredRole,
    loading,
    roleMatch: user?.role?.toUpperCase() === requiredRole?.toUpperCase(),
  });

  // Wait for auth to finish loading
  if (loading) {
    console.log('⏳ Auth loading, waiting...');
    return null; // or return a loading spinner
  }

  // Check if authenticated
  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role (case-insensitive comparison)
  if (requiredRole) {
    const userRole = user?.role?.toUpperCase();
    const required = requiredRole.toUpperCase();
    
    console.log('🔍 Role comparison:', {
      userRole,
      required,
      match: userRole === required,
    });

    if (userRole !== required) {
      console.log('❌ Insufficient permissions, redirecting to /');
      return <Navigate to="/" replace />;
    }
  }

  console.log('✅ Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
