const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006/api';

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
    requiresAuth?: boolean;
};

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('accessToken');
        }
        return null;
    }

    async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { method = 'GET', body, headers = {}, requiresAuth = true } = options;

        const requestHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            ...headers,
        };

        if (requiresAuth) {
            const token = this.getToken();
            if (token) {
                requestHeaders['Authorization'] = `Bearer ${token}`;
            }
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method,
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(data.message || 'An error occurred', response.status, data);
        }

        return data as T;
    }

    // Convenience methods
    get<T>(endpoint: string, requiresAuth = true) {
        return this.request<T>(endpoint, { method: 'GET', requiresAuth });
    }

    post<T>(endpoint: string, body: unknown, requiresAuth = true) {
        return this.request<T>(endpoint, { method: 'POST', body, requiresAuth });
    }

    patch<T>(endpoint: string, body: unknown, requiresAuth = true) {
        return this.request<T>(endpoint, { method: 'PATCH', body, requiresAuth });
    }

    delete<T>(endpoint: string, requiresAuth = true) {
        return this.request<T>(endpoint, { method: 'DELETE', requiresAuth });
    }
}

export class ApiError extends Error {
    status: number;
    data: unknown;

    constructor(message: string, status: number, data: unknown) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
