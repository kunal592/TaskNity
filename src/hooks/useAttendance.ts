'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceService, type CreateAttendanceDto } from '@/services';
import toast from 'react-hot-toast';

export const ATTENDANCE_QUERY_KEY = ['attendance'];

export function useAllAttendance() {
    return useQuery({
        queryKey: ATTENDANCE_QUERY_KEY,
        queryFn: () => attendanceService.getAll(),
    });
}

export function useTodayAttendance() {
    return useQuery({
        queryKey: [...ATTENDANCE_QUERY_KEY, 'today'],
        queryFn: () => attendanceService.getToday(),
    });
}

export function useMyAttendance() {
    return useQuery({
        queryKey: [...ATTENDANCE_QUERY_KEY, 'my'],
        queryFn: () => attendanceService.getMy(),
    });
}

export function useUserAttendance(userId: string) {
    return useQuery({
        queryKey: [...ATTENDANCE_QUERY_KEY, 'user', userId],
        queryFn: () => attendanceService.getByUser(userId),
        enabled: !!userId,
    });
}

export function useMarkAttendance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateAttendanceDto) => attendanceService.mark(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ATTENDANCE_QUERY_KEY });
            toast.success('Attendance marked successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to mark attendance');
        },
    });
}
