import { apiClient } from '@/lib/api-client';
import type { Task, CreateTaskDto, UpdateTaskDto } from './api.types';

export const tasksService = {
    /**
     * Get all non-classified, non-draft tasks (for Kanban board)
     */
    getAll: (projectId?: string) => {
        const query = projectId ? `?projectId=${projectId}` : '';
        return apiClient.get<Task[]>(`/tasks${query}`);
    },

    /**
     * Get classified tasks (Admin/Owner only)
     */
    getClassified: () => apiClient.get<Task[]>('/tasks/classified'),

    /**
     * Get all tasks for a specific project (including drafts)
     */
    getByProject: (projectId: string) =>
        apiClient.get<Task[]>(`/tasks/project/${projectId}`),

    /**
     * Get a specific task by ID
     */
    getById: (id: string) => apiClient.get<Task>(`/tasks/${id}`),

    /**
     * Create a new task
     */
    create: (data: CreateTaskDto) =>
        apiClient.post<Task>('/tasks', data),

    /**
     * Update a task (status, assignees, etc.)
     */
    update: (id: string, data: UpdateTaskDto) =>
        apiClient.patch<Task>(`/tasks/${id}`, data),

    /**
     * Delete a task (Admin only)
     */
    delete: (id: string) =>
        apiClient.delete<{ message: string }>(`/tasks/${id}`),

    /**
     * Quick status update for Kanban drag-drop
     */
    updateStatus: (id: string, status: Task['status']) =>
        apiClient.patch<Task>(`/tasks/${id}`, { status }),
};
