'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expensesService, type CreateExpenseDto, type UpdateExpenseDto } from '@/services';
import toast from 'react-hot-toast';

export const EXPENSES_QUERY_KEY = ['expenses'];

export function useAllExpenses() {
    return useQuery({
        queryKey: EXPENSES_QUERY_KEY,
        queryFn: () => expensesService.getAll(),
    });
}

export function useMyExpenses() {
    return useQuery({
        queryKey: [...EXPENSES_QUERY_KEY, 'my'],
        queryFn: () => expensesService.getMy(),
    });
}

export function useCreateExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateExpenseDto) => expensesService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EXPENSES_QUERY_KEY });
            toast.success('Expense submitted successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to submit expense');
        },
    });
}

export function useUpdateExpenseStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateExpenseDto }) =>
            expensesService.updateStatus(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: EXPENSES_QUERY_KEY });
            toast.success(`Expense ${variables.data.status.toLowerCase()}`);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update expense status');
        },
    });
}
