import { apiClient } from '@/lib/api-client';
import type { Expense, CreateExpenseDto, UpdateExpenseDto } from './api.types';

export const expensesService = {
    /**
     * Get all expense claims (Admin only)
     */
    getAll: () => apiClient.get<Expense[]>('/expenses'),

    /**
     * Get current user's expense claims
     */
    getMy: () => apiClient.get<Expense[]>('/expenses/my'),

    /**
     * Submit a new expense claim
     */
    create: (data: CreateExpenseDto) =>
        apiClient.post<Expense>('/expenses', data),

    /**
     * Approve or reject an expense (Admin only)
     */
    updateStatus: (id: string, data: UpdateExpenseDto) =>
        apiClient.patch<Expense>(`/expenses/${id}`, data),
};
