import { apiClient } from '@/lib/api-client';
import type { Attendance, CreateAttendanceDto } from './api.types';

export const attendanceService = {
    /**
     * Get all attendance records (Admin only)
     */
    getAll: () => apiClient.get<Attendance[]>('/attendance'),

    /**
     * Get today's attendance for all users
     */
    getToday: () => apiClient.get<Attendance[]>('/attendance/today'),

    /**
     * Get current user's attendance history
     */
    getMy: () => apiClient.get<Attendance[]>('/attendance/my'),

    /**
     * Get a specific user's attendance (Admin only)
     */
    getByUser: (userId: string) =>
        apiClient.get<Attendance[]>(`/attendance/user/${userId}`),

    /**
     * Mark attendance for today
     */
    mark: (data: CreateAttendanceDto) =>
        apiClient.post<Attendance>('/attendance', data),
};
