import { axiosInstance } from '../lib/axios';
import { authStorage } from '../lib/auth-storage';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/movie.types';

class AuthService {
  /**
   * Login user with username and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
      await this.syncCurrentUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/register', credentials);
      await this.syncCurrentUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await axiosInstance.get<User>('/auth/me');
      authStorage.setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      authStorage.clear();
    }
  }

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    return authStorage.getUser();
  }

  /**
   * Check current cookie session with backend
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }

  private async syncCurrentUser(authResponse: AuthResponse): Promise<void> {
    if (authResponse.user) {
      authStorage.setUser(authResponse.user);
      return;
    }

    await this.getCurrentUser();
  }
}

export const authService = new AuthService();
