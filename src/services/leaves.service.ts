import { apiClient } from '@/lib/api-client';
import type { Leave, CreateLeaveDto, UpdateLeaveDto } from './api.types';

export const leavesService = {
    /**
     * Get all leave requests (Admin only)
     */
    getAll: () => apiClient.get<Leave[]>('/leaves'),

    /**
     * Get current user's leave requests
     */
    getMy: () => apiClient.get<Leave[]>('/leaves/my'),

    /**
     * Apply for leave
     */
    create: (data: CreateLeaveDto) =>
        apiClient.post<Leave>('/leaves', data),

    /**
     * Approve or reject a leave request (Admin only)
     */
    updateStatus: (id: string, data: UpdateLeaveDto) =>
        apiClient.patch<Leave>(`/leaves/${id}`, data),
};
