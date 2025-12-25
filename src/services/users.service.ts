import { apiClient } from '@/lib/api-client';
import type { User, UpdateUserDto } from './api.types';

export const usersService = {
    /**
     * Get all users in the organization
     */
    getAll: () => apiClient.get<User[]>('/users'),

    /**
     * Get current user's profile
     */
    getMe: () => apiClient.get<User>('/users/me'),

    /**
     * Get a specific user by ID
     */
    getById: (id: string) => apiClient.get<User>(`/users/${id}`),

    /**
     * Update a user's profile (Admin only)
     */
    update: (id: string, data: UpdateUserDto) =>
        apiClient.patch<User>(`/users/${id}`, data),

    /**
     * Delete/terminate a user (Admin only)
     */
    delete: (id: string) =>
        apiClient.delete<{ message: string }>(`/users/${id}`),
};
