// Auth API Service
// Centralized auth-related API calls

import type { IApiResponse, IAuthResponse, ILoginRequest, ISignupRequest } from '../interfaces';
import { axiosInstance } from '../config';

export class AuthService {
  /**
   * Login user
   */
  static async login(credentials: ILoginRequest): Promise<IAuthResponse> {
    const response = await axiosInstance.post<IApiResponse<IAuthResponse>>(
      '/auth/login',
      credentials
    );
    return response.data.data as IAuthResponse;
  }

  /**
   * Sign up user
   */
  static async signup(userData: ISignupRequest): Promise<IAuthResponse> {
    const response = await axiosInstance.post<IApiResponse<IAuthResponse>>(
      '/auth/signup',
      userData
    );
    return response.data.data as IAuthResponse;
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<any> {
    const response = await axiosInstance.get<IApiResponse<any>>(
      '/auth/me'
    );
    return response.data.data;
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    await axiosInstance.post('/auth/logout', {});
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(refreshToken: string): Promise<IAuthResponse> {
    const response = await axiosInstance.post<IApiResponse<IAuthResponse>>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data.data as IAuthResponse;
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: Partial<any>): Promise<any> {
    const response = await axiosInstance.put<IApiResponse<any>>(
      '/auth/profile',
      data
    );
    return response.data.data;
  }

  /**
   * Change password
   */
  static async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    await axiosInstance.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
  }
}

export default AuthService;
