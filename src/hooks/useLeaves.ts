'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leavesService, type CreateLeaveDto, type UpdateLeaveDto } from '@/services';
import toast from 'react-hot-toast';

export const LEAVES_QUERY_KEY = ['leaves'];

export function useAllLeaves() {
    return useQuery({
        queryKey: LEAVES_QUERY_KEY,
        queryFn: () => leavesService.getAll(),
    });
}

export function useMyLeaves() {
    return useQuery({
        queryKey: [...LEAVES_QUERY_KEY, 'my'],
        queryFn: () => leavesService.getMy(),
    });
}

export function useApplyLeave() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateLeaveDto) => leavesService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LEAVES_QUERY_KEY });
            toast.success('Leave request submitted');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to submit leave request');
        },
    });
}

export function useUpdateLeaveStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateLeaveDto }) =>
            leavesService.updateStatus(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: LEAVES_QUERY_KEY });
            toast.success(`Leave request ${variables.data.status.toLowerCase()}`);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update leave status');
        },
    });
}
