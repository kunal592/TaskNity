import { apiClient } from '@/lib/api-client';
import type { Project, CreateProjectDto, UpdateProjectDto } from './api.types';

export const projectsService = {
    /**
     * Get all projects (filtered by role)
     */
    getAll: () => apiClient.get<Project[]>('/projects'),

    /**
     * Get a specific project with tasks and members
     */
    getById: (id: string) => apiClient.get<Project>(`/projects/${id}`),

    /**
     * Create a new project (Admin only)
     */
    create: (data: CreateProjectDto) =>
        apiClient.post<Project>('/projects', data),

    /**
     * Update a project (Admin only)
     */
    update: (id: string, data: UpdateProjectDto) =>
        apiClient.patch<Project>(`/projects/${id}`, data),

    /**
     * Delete a project (Admin only)
     */
    delete: (id: string) =>
        apiClient.delete<{ message: string }>(`/projects/${id}`),
};
