'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService, type CreateProjectDto, type UpdateProjectDto } from '@/services';
import toast from 'react-hot-toast';

export const PROJECTS_QUERY_KEY = ['projects'];

export function useProjects() {
    return useQuery({
        queryKey: PROJECTS_QUERY_KEY,
        queryFn: () => projectsService.getAll(),
    });
}

export function useProject(id: string) {
    return useQuery({
        queryKey: [...PROJECTS_QUERY_KEY, id],
        queryFn: () => projectsService.getById(id),
        enabled: !!id,
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateProjectDto) => projectsService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
            toast.success('Project created successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create project');
        },
    });
}

export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateProjectDto }) =>
            projectsService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
            toast.success('Project updated successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update project');
        },
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => projectsService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
            toast.success('Project deleted successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete project');
        },
    });
}
