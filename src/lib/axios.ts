import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { authStorage } from './auth-storage';

// Create axios instance with default config
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle 401 unauthorized
      if (
        error.response?.status === 401 &&
        !['/login', '/register'].includes(window.location.pathname)
      ) {
        authStorage.clear();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const axiosInstance = createAxiosInstance();

export const getAxiosConfig = (): AxiosRequestConfig => ({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
