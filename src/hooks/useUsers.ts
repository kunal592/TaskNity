'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService, type UpdateUserDto } from '@/services';
import toast from 'react-hot-toast';

export const USERS_QUERY_KEY = ['users'];

export function useUsers() {
    return useQuery({
        queryKey: USERS_QUERY_KEY,
        queryFn: () => usersService.getAll(),
    });
}

export function useUser(id: string) {
    return useQuery({
        queryKey: [...USERS_QUERY_KEY, id],
        queryFn: () => usersService.getById(id),
        enabled: !!id,
    });
}

export function useCurrentUser() {
    return useQuery({
        queryKey: [...USERS_QUERY_KEY, 'me'],
        queryFn: () => usersService.getMe(),
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
            usersService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
            toast.success('User updated successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update user');
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => usersService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
            toast.success('User deleted successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete user');
        },
    });
}
