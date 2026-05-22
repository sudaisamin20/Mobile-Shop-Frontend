// Axios instance configuration with interceptors
// Handles authentication, token refresh, and error handling

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { config } from "./environment";
import { CookieService } from "./cookies";

class AxiosService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.api.baseURL,
      timeout: config.api.timeout,
      withCredentials: true, // Include cookies in requests
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request Interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add auth token to headers
        const token = CookieService.getAuthToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response Interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 401 - Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = CookieService.getRefreshToken();
            if (!refreshToken) {
              // No refresh token, redirect to login
              CookieService.removeAuthCookies();
              window.location.href = "/login";
              return Promise.reject(error);
            }

            // Try to refresh the token
            const response = await axios.post(
              `${config.api.baseURL}/auth/refresh`,
              { refreshToken },
              {
                withCredentials: true,
              },
            );

            const { token, refreshToken: newRefreshToken } = response.data.data;

            // Update cookies
            CookieService.setAuthToken(token);
            if (newRefreshToken) {
              CookieService.setRefreshToken(newRefreshToken);
            }

            // Retry original request
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            CookieService.removeAuthCookies();
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors
        if (error.response) {
          // Server responded with error status
          const errorData = error.response.data;
          error.message = errorData?.message || "An error occurred";
        } else if (error.request) {
          // Request made but no response
          error.message = "No response from server";
        } else {
          // Error in request setup
          error.message = "Error setting up request";
        }

        return Promise.reject(error);
      },
    );
  }

  /**
   * Get the axios instance
   */
  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * GET request
   */
  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  /**
   * POST request
   */
  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  /**
   * PUT request
   */
  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  /**
   * PATCH request
   */
  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }
}

// Export singleton instance
export const axiosInstance = new AxiosService();

export default axiosInstance;
