// Utility functions for cookie management
// Uses js-cookie for secure, cross-browser cookie handling

import Cookies from 'js-cookie';
import { config } from './environment';

export class CookieService {
  /**
   * Set a cookie with application default settings
   */
  static set(
    name: string,
    value: string,
    options?: Cookies.CookieAttributes
  ): void {
    const defaultOptions: Cookies.CookieAttributes = {
      path: config.cookies.path,
      sameSite: config.cookies.sameSite,
      secure: config.cookies.secure,
      ...options,
    };

    Cookies.set(name, value, defaultOptions);
  }

  /**
   * Get a cookie value
   */
  static get(name: string): string | undefined {
    return Cookies.get(name);
  }

  /**
   * Remove a cookie
   */
  static remove(name: string): void {
    Cookies.remove(name, { path: config.cookies.path });
  }

  /**
   * Check if a cookie exists
   */
  static exists(name: string): boolean {
    return Cookies.get(name) !== undefined;
  }

  /**
   * Clear all application cookies
   */
  static clearAll(): void {
    Cookies.remove(config.cookies.authToken, { path: config.cookies.path });
    Cookies.remove(config.cookies.refreshToken, { path: config.cookies.path });
    Cookies.remove(config.cookies.userData, { path: config.cookies.path });
  }

  /**
   * Set authentication token cookie
   */
  static setAuthToken(token: string): void {
    this.set(config.cookies.authToken, token, {
      expires: config.cookies.expires,
    });
  }

  /**
   * Get authentication token
   */
  static getAuthToken(): string | undefined {
    return this.get(config.cookies.authToken);
  }

  /**
   * Set refresh token cookie
   */
  static setRefreshToken(token: string): void {
    this.set(config.cookies.refreshToken, token, {
      expires: config.cookies.expires,
    });
  }

  /**
   * Get refresh token
   */
  static getRefreshToken(): string | undefined {
    return this.get(config.cookies.refreshToken);
  }

  /**
   * Set user data cookie (JSON stringified)
   */
  static setUserData(userData: Record<string, any>): void {
    this.set(config.cookies.userData, JSON.stringify(userData));
  }

  /**
   * Get user data cookie (parsed JSON)
   */
  static getUserData(): Record<string, any> | null {
    const data = this.get(config.cookies.userData);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  /**
   * Remove all auth related cookies
   */
  static removeAuthCookies(): void {
    this.remove(config.cookies.authToken);
    this.remove(config.cookies.refreshToken);
    this.remove(config.cookies.userData);
  }
}

export default CookieService;
