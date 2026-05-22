// Authentication Hooks
// Custom hooks for auth operations

import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/index';
import {
  loginUser,
  signupUser,
  logoutUser,
  checkAuth,
  clearError,
} from '../app/slices/authSlice';
import type { ILoginRequest, ISignupRequest } from '../interfaces';

export const useAuth = () => {
  const dispatch = useAppDispatch() as any;
  const { user, loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: ILoginRequest) => {
      return dispatch(loginUser(credentials));
    },
    [dispatch]
  );

  const signup = useCallback(
    async (userData: ISignupRequest) => {
      return dispatch(signupUser(userData));
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    return dispatch(logoutUser());
  }, [dispatch]);

  const verify = useCallback(async () => {
    return dispatch(checkAuth());
  }, [dispatch]);

  const clearErrorMessage = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    signup,
    logout,
    verify,
    clearErrorMessage,
  };
};

/**
 * Hook to verify authentication on mount
 * Useful for protecting routes and checking auth status
 */
export const useAuthVerify = () => {
  const { verify } = useAuth();

  useEffect(() => {
    verify();
  }, [verify]);
};

export default useAuth;
