import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../types/api';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:9090';
    
export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  onUnauthorized = handler;
};

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export class ApiError extends Error {
  status?: number;
  path?: string;

  constructor(message: string, status?: number, path?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.path = path;
  }
}

const isAuthEndpoint = (url?: string) =>
  !!url && (url.includes('/auth/login') || url.includes('/auth/registrar'));

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (!error.response) {
      return Promise.reject(
        new ApiError('Não foi possível conectar ao servidor. Verifique sua internet e a URL da API.')
      );
    }

    const { status, data } = error.response;
    const message = data?.message || 'Ocorreu um erro inesperado. Tente novamente mais tarde.';

    if (status === 401 && !isAuthEndpoint(error.config?.url)) {
      onUnauthorized?.();
    }

    return Promise.reject(new ApiError(message, status, data?.path));
  }
);

export default api;
