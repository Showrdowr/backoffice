import { API_CONFIG } from '@/config/constants';
import type { ApiResponse, PaginatedResponse } from '@/types';

export class ApiError extends Error {
    statusCode: number;
    code?: string;
    details?: unknown;

    constructor(message: string, options?: { statusCode?: number; code?: string; details?: unknown }) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = options?.statusCode || 500;
        this.code = options?.code;
        this.details = options?.details;
    }
}

class ApiClient {
    private baseURL: string;
    private timeout: number;

    constructor() {
        this.baseURL = API_CONFIG.baseURL;
        this.timeout = API_CONFIG.timeout;
    }

    private async request<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<ApiResponse<T>> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        // Get auth token from localStorage
        const token = typeof window !== 'undefined' ? sessionStorage.getItem('backoffice_token') : null;

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers: {
                    ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                    ...options?.headers,
                },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.status === 401) {
                // Token expired or invalid — clear auth and redirect
                if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('backoffice_token');
                    sessionStorage.removeItem('backoffice_user');
                    window.location.href = '/login';
                }
                throw new Error('Unauthorized');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                let message = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
                if (Array.isArray(errorData.details) && errorData.details.length > 0) {
                    const first = errorData.details[0];
                    if (first?.message) {
                        const path = Array.isArray(first.path) ? first.path.join('.') : '';
                        message += path ? ` (${path}: ${first.message})` : ` (${first.message})`;
                    }
                }
                throw new ApiError(message, {
                    statusCode: response.status,
                    code: errorData.code,
                    details: errorData.details,
                });
            }

            const data = await response.json();
            return data;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === 'AbortError') {
                const timeoutError = new ApiError('คำขอใช้เวลานานเกินกำหนด กรุณาลองใหม่อีกครั้ง', {
                    statusCode: 408,
                    code: 'REQUEST_TIMEOUT',
                });
                console.error('API request timed out:', timeoutError);
                throw timeoutError;
            }
            console.error('API request failed:', error);
            throw error;
        }
    }

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
            ...(data ? { body: JSON.stringify(data) } : {}),
        });
    }

    async getPaginated<T>(
        endpoint: string,
        page: number = 1,
        limit: number = 20
    ): Promise<PaginatedResponse<T>> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        const response = await this.request<PaginatedResponse<T>>(
            `${endpoint}?${params}`
        );

        return response.data as PaginatedResponse<T>;
    }
}

export const apiClient = new ApiClient();
